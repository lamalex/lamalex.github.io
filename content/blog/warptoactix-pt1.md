+++
title = "Refactoring Rust: `let service = Actix::from<Warp>()` pt. 1"
date = 2021-10-31
tags = ["rust", "grad school", "engineering", "cloud native", "web"]
+++

### This post is a part of a series
For a variety of reasons I am refactoring a web server that I built using Warp, to an equivalent service built on Actix.
I bought [Luca Palmieri's book `Zero To Production In Rust`](https://www.zero2prod.com) a long time ago, and wanted to integrate some of it into
this web service, but never got around to it. Now I have some spare time, and some practical incentive. Rather than just copying the book and implementing
the mailing list service that he builds, I thought I would walk through it and incorporate the concepts into this Rust service, hopefully also fixing the bug that we are experiencing.
Nothing in here should be interperted to be "the best way", but is an experimental work in progress. Please feel free to [reach out](mailto:dev@launi.me) if there is something you think I could be doing better!


### Part 1: Our First Endpoint: A Basic Health Check
*This post is being written post-facto. Some of the code snippets may not be 100% correct. In the future I will try to blog contemporanesously with the work.*


In Luca's book the first semi-meaningful route we define is a health check app. Our existing service has a similar endpoint at `/v1/heartbeat` which returns a monotonically increasing u64 value.
The hard part we will face is abstracting over the webserver implementation we are using so that `Actix` or `Warp` can be switched off and on at compile time.

First we need to create an instance of a webserver. Both Actix and Warp use Rust's async infrastructure, and can use Tokio as the async runtime. Luca provides this sample code to create a server in Actix
```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
HttpServer::new(|| { App::new()
.route("/", web::get().to(greet)) .route("/{name}", web::get().to(greet))
    })
    .bind("127.0.0.1:8000")?
    .run()
    .await
}
```

in our current Warp based implementation we do:

```rust
mod webserver {
    use super::filters;

    use std::net::SocketAddrV4;
    use warp::Filter;

    use liftright_data_server::LrdsError;

    #[tokio::main]
    pub async fn run(port: u32) -> Result<(), LrdsError> {
        let db = liftright_data_server::establish_db_connection().await?;

        let api = filters::rest_api(db).with(warp::log("liftright_data_server"));

        let addr: SocketAddrV4 = format!("0.0.0.0:{}", port)
            .parse()
            .expect("Could not create IP.");

        warp::serve(api).run(addr).await;
        Ok(())
    }
}
```

It looks like we have something like a common denominator here. Both servers have a `run` method that returns a future, and return a `Result` type. We can update our main to have 2 near equal versions depending on the value of our `actix` feature flag.
```rust

// NOTE: ***
//  I'm still thinking about a way to only have the runtime proc macro be feature flag dependent
//  so that I can combine the implementations. I think a small macro should work, but it's
//  a low priority enhancement.
#[cfg(feature = "actix")]
#[actix_web::main]
async fn run(port: u64) -> Result<(), LrdsError> {
    webserver::run(port)?.await.unwrap();
    Ok(())
}

#[cfg(not(feature = "actix"))]
#[tokio::main]
async fn run(port: u64) -> Result<(), LrdsError> {
    webserver::run(port)?.await.unwrap();
    Ok(())
}

pub mod webserver {
    ...

    pub async fn run(port: u64) -> Result<(), LrdsError> {
        webserver_impl::run(port)?.await
    }

    #[cfg(feature = "actix")]
    mod webserver_impl {
        ...

        pub fn run(port: u64) -> std::io::Result<()> {
            let server = HttpServer::new(|| {
                App::new()
                    .route("/", web::get().to(greet))
                    .route("/{name}", web::get().to(greet))
                    .route("v1/heartbeat", web::get().to(health_check))
            })
            .bind(format!("127.0.0.0:{}", port))?
            .run()
            .await;

            Ok(())
        }   
    }

    #[cfg(not(feature = "actix"))]
    mod webserver_impl {
        ...

        pub async fn run(port: u64) -> Result<(), LrdsError> {
            let db = crate::establish_db_connection().await?;
            let api = filters::rest_api(db).with(warp::log("liftright_data_server"));

            let addr: SocketAddrV4 = format!("0.0.0.0:{}", port)
                .parse()
                .expect("Could not create IP.");

            warp::serve(api).run(addr).await;
            Ok(())
        }
    }
```

Hey cool! This works! Actix can now be started with the flip of a `--features actix` switch on `cargo run`. Adding the health check endpoint is trivial (and would just be plaigarized from the book).
To make the implementations match I slightly changed the `health_check` body to return a timestamp, but the first hurdle has been overcome. We can switch webservers! Truly, at this point there's not much benefit. Almost all of the code is duplicated, but we've basically just touched the framework pieces and none of our application logic. Hopefully we'll be able to share more of that down the road. For now at least step 1 of the experiment was successful.

The next post will cover setting up integration testing. This post will also be written post-facto, but setting up the integration testing was the impetus for blogging about this.

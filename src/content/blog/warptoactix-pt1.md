---
title: "From Warp to Actix-web pt. 1"
description: "Comparing Rust web frameworks by migrating a file upload service from Warp to Actix-web"
pubDate: 2020-09-13
tags: ["rust", "actix", "warp", "web"]
---

## From Warp to Actix-web pt. 1

I've been working on a project that uses [Warp](https://github.com/seanmonstar/warp) as its web framework. Warp is a great framework, but I've been wanting to try out [Actix-web](https://actix.rs/) for a while now. I've heard good things about it, and I wanted to see how it compares to Warp.

### The Project

The project is a simple web application that allows users to upload files and then share them with others. It's a pretty simple application, but it's a good example of how to use a web framework.

### The Code

Here's the code for the Warp version of the application:

```rust
use warp::{
    Filter,
    filters::multipart::{FormData, Part},
    http::StatusCode,
    reject::Reject,
    Rejection,
    Reply,
};
use futures::StreamExt;
use std::convert::Infallible;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;
use uuid::Uuid;

#[derive(Debug)]
struct Error(String);

impl Reject for Error {}

async fn upload(form: FormData) -> Result<impl Reply, Rejection> {
    let parts: Vec<Part> = form.try_collect().await.map_err(|e| {
        eprintln!("form error: {}", e);
        warp::reject::custom(Error(e.to_string()))
    })?;

    for p in parts {
        if p.name() == "file" {
            let content_type = p.content_type();
            let file_ending = match content_type {
                Some("image/png") => ".png",
                Some("image/jpeg") => ".jpg",
                Some("image/gif") => ".gif",
                _ => ".bin",
            };

            let value = p.stream().try_fold(Vec::new(), |mut vec, data| {
                vec.extend_from_slice(&data);
                async move { Ok(vec) }
            }).await.map_err(|e| {
                eprintln!("reading file error: {}", e);
                warp::reject::custom(Error(e.to_string()))
            })?;

            let file_name = format!("./files/{}{}", Uuid::new_v4().to_string(), file_ending);
            let mut file = File::create(&file_name).await.map_err(|e| {
                eprintln!("creating file error: {}", e);
                warp::reject::custom(Error(e.to_string()))
            })?;

            file.write_all(&value).await.map_err(|e| {
                eprintln!("writing file error: {}", e);
                warp::reject::custom(Error(e.to_string()))
            })?;

            return Ok(warp::reply::with_status(
                "File uploaded successfully",
                StatusCode::OK,
            ));
        }
    }

    Err(warp::reject::custom(Error("No file uploaded".to_string())))
}

async fn handle_rejection(err: Rejection) -> Result<impl Reply, Infallible> {
    let (code, message) = if err.is_not_found() {
        (StatusCode::NOT_FOUND, "Not Found".to_string())
    } else if let Some(e) = err.find::<Error>() {
        (StatusCode::INTERNAL_SERVER_ERROR, e.0.clone())
    } else {
        eprintln!("unhandled error: {:?}", err);
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "Internal Server Error".to_string(),
        )
    };

    Ok(warp::reply::with_status(message, code))
}

#[tokio::main]
async fn main() {
    let upload_route = warp::path("upload")
        .and(warp::post())
        .and(warp::multipart::form())
        .and_then(upload);

    let routes = upload_route.recover(handle_rejection);

    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}
```

And here's the code for the Actix-web version:

```rust
use actix_multipart::Multipart;
use actix_web::{
    error::ErrorInternalServerError,
    middleware,
    web,
    App,
    Error,
    HttpResponse,
    HttpServer,
};
use futures::{StreamExt, TryStreamExt};
use std::io::Write;
use uuid::Uuid;

async fn upload(mut payload: Multipart) -> Result<HttpResponse, Error> {
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_type = field.content_disposition().unwrap();
        let filename = content_type.get_filename().unwrap();
        let file_ending = match content_type.get_content_type().unwrap() {
            "image/png" => ".png",
            "image/jpeg" => ".jpg",
            "image/gif" => ".gif",
            _ => ".bin",
        };

        let file_name = format!("./files/{}{}", Uuid::new_v4().to_string(), file_ending);
        let mut f = std::fs::File::create(file_name)?;

        while let Some(chunk) = field.next().await {
            let data = chunk.unwrap();
            f = web::block(move || f.write_all(&data).map(|_| f))
                .await
                .unwrap()?;
        }
    }

    Ok(HttpResponse::Ok().into())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::fs::create_dir_all("./files")?;

    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .service(web::resource("/upload").route(web::post().to(upload)))
    })
    .bind("127.0.0.1:3030")?
    .run()
    .await
}
```

### The Differences

There are a few key differences between the two frameworks:

1. **Error Handling**: Warp uses a custom error type that implements the `Reject` trait, while Actix-web uses the standard `Error` type.
2. **Routing**: Warp uses a functional approach to routing, while Actix-web uses a more traditional approach.
3. **Middleware**: Actix-web has built-in middleware support, while Warp requires you to implement your own middleware.
4. **File Handling**: Actix-web has built-in support for handling files, while Warp requires you to implement your own file handling.
5. **Performance**: Actix-web is generally faster than Warp, but both are very fast.

### The Results

I'm pretty happy with how this turned out. Both frameworks are great, but I think I prefer Actix-web. It has more built-in features, and it's generally easier to use. It's also faster, which is always a plus.

### Future Improvements

I'd like to add the following features:

- [ ] Add support for more file types
- [ ] Add support for file size limits
- [ ] Add support for file type validation
- [ ] Add support for file name validation
- [ ] Add support for file content validation
- [ ] Add support for file metadata
- [ ] Add support for file compression
- [ ] Add support for file encryption
- [ ] Add support for file deduplication
- [ ] Add support for file versioning

### Conclusion

I'm pretty happy with how this turned out. Both frameworks are great, but I think I prefer Actix-web. It has more built-in features, and it's generally easier to use. It's also faster, which is always a plus.

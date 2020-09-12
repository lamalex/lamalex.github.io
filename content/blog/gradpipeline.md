+++
title = "Grad students should have a CI/CD pipeline"
date = 2020-09-11
tags = ["grad school", "CI", "CD", "CI/CD", "devops"]
+++

This semester I'm fortunate enough to take part in a pilot course where we will be developing curriculum for an undergrad software engineering course. This new course is meant as a follow on to Old Dominions required undergrad software engineering, CS350. In grad school I work on an iOS app written mostly in Swift with a C library generated from Matlab. We're working on building a system to help physical therapists monitor their patients progress through a wearable. My work focuses on building user interfaces that via game mechanics implicitly nudge users towards meeting certain range-of-motion goals. We're basically building a game in which your range-of-motion is the primary interface. I would say more, but we have multiple papers pending review!

​    

I now have a continuous delivery system in place, but prior I was just off on my own building without input from my stakeholders (my research PI).

​    

## Why do grad students need CI?

I had been assuming that my advisor was checking GitHub, pulling down my changes, running the application, and I took not getting feedback about the app as good feedback. The reality is that I was working mostly in isolation. There was too much friction for getting my work into the hands of my advisor for testing. By the time I realized this I had a fully working prototype and thought we were ready to start using it to collect data! I packaged everything up, set up TestFlight for distribution and added my advisor so she could install a release build on her phone and test it.

​    

Our next meeting was a disaster. She hated it! And in retrospect, fair enough. It didn't succeed at its goal. I'd gotten too bogged down in the weeds, I'd lost sight of whether or not my tool was serving its purpose.  A lot of what I had worked on was still usable, and all the time I'd taken to make the application architecture well designed would pay off as I refactored the interface, but I could have saved myself a month if I had just **gotten my application to my stakeholders early**. This seems obvious. I've read [The DevOps handbook](https://itrevolution.com/the-devops-handbook/), and I was testing and running tests, but I hadn't made the connection that my PI is not another developer; during development she is the customer.

​    

## What I built
If you're a student, you have access to the [GitHub Student Developer pack](https://education.github.com/pack). This is a wonderful resource for student developers that gives you access to a plethora of industry tools for **free**. For example, a free GitHub pro account, and [Travis CI](https://education.travis-ci.com) gives you free unlimited private builds, 2 years of a pro datadog account, mailgun, and a ton more! It's an awesome program. Travis is really easy to use. You just connect your github account and give it `repo` scope so it can access your private repositories. Then you write a small .yml configuration. Mine looks like this:
```yaml
language: swift
os:
  - osx
cache:
  bundler: true
  cocoapods: true
osx_image: xcode11.5
install:
  - bundle install
  - pod install
script:
  - bundle exec danger
  - bundle exec fastlane test
  - 'if [ "$TRAVIS_PULL_REQUEST" = "false" ]; then bash ./scripts/travis-deploy.sh; fi'
xcode_project: liftright.xcworkspace # path to your xcodeproj folder
xcode_scheme: liftrightTests
xcode_destination: platform=iOS Simulator,OS=13.0,name=iPhone 11 Pro, iPhone 8
```

This will run danger (which lints and checks for obviously wrong things in a pull request), then runs my test suite, and finally if not a pull request branch runs a script to deploy straight to TestFlight, where my PI will get a notification on her phone that I made an update. This script is really straight forward. 

```bash
#!/bin/bash
set -ev

# We only want to push from trunk.
# Did you know emojis are valid in git branch names?
if [ "${TRAVIS_BRANCH}" != "game-ui-🚀" ]; then
    exit 0
fi

# We bump the build number to today's date so we can be sure
# that we supercede the newest version in TestFlight.
buildNumber=$(date +"%Y.%m.%d.%H%M%S")
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $buildNumber" liftright/Info.plist

# We have 2 deploy targets. Staging is for development builds.
# Extra debugging might be enabled, 
# data is logged to a more volatile server, etc.
# If the commit has been tagged as "release" 
# then it gets pushed to the server for our actual users
if [ "${TRAVIS_TAG}" = "release" ]; then
    bundle exec fastlane release
else
    bundle exec fastlane staging
fi
```

And the final piece of the puzzle is [Fastlane](https://fastlane.tools) which is an
all-in-one tool for managing iOS and android deployment. I'm using fastlane for
test running, managing signing certificates, and deploying to staging/production.

```ruby
# This file contains the fastlane.tools configuration
# You can find the documentation at https://docs.fastlane.tools
#
# For a list of all available actions, check out
#
#     https://docs.fastlane.tools/actions
#
# For a list of all available plugins, check out
#
#     https://docs.fastlane.tools/plugins/available-plugins
#

setup_travis
default_platform(:ios)

platform :ios do
  $app_ids = {
    :nightly => "edu.odu.cs.liftright.nightly",
    :staging => "edu.odu.cs.liftright.staging",
    :release => "edu.odu.cs.liftright"
  }
  
  def prepare_match(ro=true)
    ["development", "adhoc", "appstore"].each do |type|
      match(type: type, readonly: ro, app_identifier: $app_ids.values)
    end
  end
  
  def lr_build_app(scheme:, config:)
    build_app(workspace: "liftright.xcworkspace", scheme: scheme, configuration: config)
  end

  def lr_upload_beta(app_id)
    cl = `git log --max-count=1 --format="%B"`
    upload_to_testflight(app_identifier: app_id, skip_waiting_for_build_processing: true, changelog: cl)
  end

  lane :test do
    run_tests(scheme: "liftright")
  end
  
  lane :staging do
    prepare_match
    lr_build_app(scheme: "LiftRight [Staging]", config: "Staging [Release]")
    lr_upload_beta($app_ids[:staging])
  end

  lane :release do
    prepare_match
    lr_build_app(scheme: "LiftRight [Production]", config: "Production [Release]")
    lr_upload_beta($app_ids[:release])
  end

  lane :certificates do
    prepare_match(False)
  end
end
```

This little diddy does checks out signing certificates, builds the specified configuration, and uploads to TestFlight! It also attaches the commit message off of the latest commit as a changelog so recipients can get an idea of what changed. When I approve a PR for merging I merge/squash and rewrite this commit message to be meaningful for an end user.

​    
## The result
We're going live this month! This flow enabled a fast feedback look from my work to my PI, and back. Now I could iterate and get verification on my ideas. **This is the whole idea of incremental development!** There's a good reason we moved away from the waterfall model as an industry. I think when we're working on (more or less) solo projects it's easy to lose sight of why development methodologies were designed, but if we do a little introspection and consider or *processes* as well as our product, we can build things better, and faster.
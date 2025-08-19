# gcloud setup

First run `gcloud init` and add all of your clusters. Then you can use the following Bash script to change between your clusters:

```shell
#!/bin/bash

kubectl config unset current-context

gcloud config set account "{{email_address_for_cluster}}"
gcloud config configurations activate {{configuration_name}}

gcloud config set core/account "{{email_address_for_cluster}}"
gcloud config set core/project {{cluster_project_name}}
gcloud config set compute/region {{region_of_cluster}}
gcloud config set compute/zone {{zone_of_cluster}}

kubectl config use-context {{configuration_name}}

exit 0
```

Some useful commands which can show you necessary data for above script:

```shell
gcloud auth list
gcloud projects list
gcloud config list
gcloud config configurations list

kubectl config get-contexts
kubectl config rename-context old-ctx-name new-ctx-name
```

Initial config create, for working with a k8s cluster:

```shell
gcloud config configurations create NEW_CONFIG_NAME
gcloud auth login
gcloud config set core/project PROJECT_NAME && \
  gcloud config set compute/region europe-west3 && \
  gcloud config set compute/zone europe-west3-a && \
  gcloud container clusters get-credentials CLUSTER_NAME && \
  kubectl config rename-context OLD_CTX_NAME NEW_CTX_NAME && \
  kubectl config get-contexts
```

## about these howtos

This howto is part of a larger collection of [howtos](https://howtos.rozuvan.net/) maintained by the author (mostly for his own reference). The source code for the current howto in plain Markdown is [available on GitHub](https://github.com/valera-rozuvan/howtos/blob/main/docs/009-gcloud-setup.md). If you have a GitHub account, you can jump straight in, and suggest edits or improvements via the link at the bottom of the page (**Improve this page**).

made with ❤ by [Valera Rozuvan](https://valera.rozuvan.net/)

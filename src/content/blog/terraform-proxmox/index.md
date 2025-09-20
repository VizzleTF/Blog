---
title: "Terraform + Proxmox"
summary: "Как подружить terraform с proxmox и управлять своими виртуальными машинами через terraform"
date: "Sep 15 2025"
draft: false
tags:
  - terraform
  - proxmox
  - infrastructure as a code
rss: "Terraform - это один из самых лучших и популярных инструментов для Infrastructure as a Code. В этой статье рассказываю, как подружить его с Proxmox и управлять своими виртуальными машинами через Terraform!"
seoTitle: "Terraform Proxmox: Автоматизация виртуальных машин"
seoDescription: "Полное руководство по интеграции Terraform с Proxmox. Настройка провайдера bpg/proxmox, создание VM через IaC, примеры конфигураций и best practices."
---

## Вступление

Terraform — это один из лучших и популярных инструментов для Infrastructure as Code.

Если для вас Terraform пустой звук, рекомендую ознакомиться с ним на канале ADV-IT. Того, что он рассказывает, будет достаточно для начала знакомства и понимания всего, что я буду делать (ну или почти всего). [Ссылка на плейлист](https://www.youtube.com/watch?v=R0CaxXhrfFE&list=PLg5SS_4L6LYujWDTYb-Zbofdl44Jxb2l8)

Я не буду расписывать основы данного инструмента в этой статье и сосредоточусь на связке Terraform + Proxmox через наиболее удачный, на мой взгляд, провайдер: [bpg/proxmox](https://registry.terraform.io/providers/bpg/proxmox/latest)

## Кратко о провайдере

Провайдер — это прослойка, которая объясняет Terraform, как работать с API облака (или Proxmox в нашем случае).

Есть много официальных провайдеров для облаков: AWS, Google Cloud, Yandex Cloud, Cloud.ru и так далее. Но официального провайдера для Proxmox просто не существует. Существует несколько неофициальных.

Методом проб и ошибок для себя был выбран `bpg/proxmox` — он очень редко ломает обратную совместимость, в отличие от некоторых других. А также он более 6 лет в разработке, и последняя версия 0.83.2 вышла за день до написания этой статьи.

## Как понять, что доступно?

Очень просто — к каждому приличному провайдеру существует документация, где описаны все сущности, которыми можно с его помощью управлять. Как правило, этой документации достаточно.

![Документация Terraform Proxmox Provider с описанием ресурсов и data sources](/blog/terraform-proxmox/Pasted%20image%2020250915184710.png)

## Подготовка окружения и провайдера

В первую очередь нам необходимо определиться с тем, где мы будем хранить наш state. В данном примере я буду использовать бесплатное объектное хранилище от Cloud.ru.

Создаём S3-бакет:

![Создание S3 bucket в Cloud.ru для хранения Terraform state](/blog/terraform-proxmox/CleanShot%202025-09-15%20at%2019.06.16@2x.png)

И ключ доступа для него:

![Создание access key для доступа к S3 bucket](/blog/terraform-proxmox/Pasted%20image%2020250915190740.png)


Далее создаём файл `backend.tf` с конфигурацией провайдера:

```hcl
terraform {
  backend "s3" {
    bucket                  = "terraform-state"
    key                     = "blog/terraform.tfstate"
    region                  = "ru-central-1"
    endpoint                = "https://s3.cloud.ru"
    skip_region_validation  = true
    skip_credentials_validation = true
    force_path_style        = true
    skip_metadata_api_check = true
  }
}
```

Также нам необходимо экспортировать 2 переменные:

```bash
export AWS_ACCESS_KEY_ID="<tennant_id>:<access_key>"
export AWS_SECRET_ACCESS_KEY="<secret_key>"
```

> 💡 **Внимательно!** В access key нужно положить и tennant_id и access_key через двоеточие!

После этого мы можем инициализировать terraform:

```bash
terraform init
```

![Настройка Proxmox API token для Terraform](/blog/terraform-proxmox/Pasted%20image%2020250915190915.png)

Добавляем описание провайдера и необходимые переменные:
provider.tf
```hcl
# https://registry.terraform.io/providers/bpg/proxmox/latest/docs
terraform {
  required_providers {
    proxmox = {
      source = "bpg/proxmox"
    }
  }
}

provider "proxmox" {
  endpoint = var.endpoint
  insecure = true
  username = var.proxmox_username
  password = var.main_password
}
```
variables.tf
```hcl
variable "endpoint" {
  description = "Hostname or IP of Proxmox server"
  type        = string
}

variable "proxmox_username" {
  description = "User for Proxmox API"
  type        = string
}

variable "main_password" {
  description = "Password for Proxmox API"
  type        = string
  sensitive   = true
}
```
и экспортируем переменные для безопасной передачи в переменные:
```sh
export TF_VAR_endpoint="https://XX.XX.XX.XX:8006"
export TF_VAR_proxmox_username="ваш_логин"
export TF_VAR_main_password="ваш_пароль"
```

После чего выполняем:

```bash
terraform init
```

И видим:

![Конфигурация Terraform для создания VM в Proxmox](/blog/terraform-proxmox/Pasted%20image%2020250915191609.png)

Это всё, что нам необходимо для начала управления ресурсами в Proxmox через Terraform!

## Создание ресурсов

Пришло время создать нашу первую ВМ. Но из чего? Нам нужен образ. Давайте его опишем.

Создаём файл `images.tf` для загрузки образа Ubuntu:

```hcl
resource "proxmox_virtual_environment_download_file" "latest_ubuntu_22_jammy_qcow2_img" {
  content_type = "import"
  datastore_id = "local"
  node_name    = "pve"
  url = "https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img"
  # need to rename the file to *.qcow2 to indicate the actual file format for import
  file_name = "jammy-server-cloudimg-amd64.qcow2"
}
```

Сделаем план, чтобы увидеть, что создастся в нашем кластере:

```bash
terraform plan
```

![Процесс создания VM через Terraform в Proxmox](/blog/terraform-proxmox/Pasted%20image%2020250915193654.png)

То что нужно, применяем:

```bash
terraform apply
```

Можем понаблюдать, что происходит через веб:

![Мониторинг создания VM через веб-интерфейс Proxmox](/blog/terraform-proxmox/Pasted%20image%2020250915193949.png)

Отлично, мы успешно импортировали образ:

![Статус развертывания VM в Proxmox](/blog/terraform-proxmox/Pasted%20image%2020250915194017.png)

Давайте наконец создадим нашу первую ВМ!

Создаём файл `vm.tf` и копипастим в него конфиг из документации провайдера, чуть подправив:
```hcl
resource "proxmox_virtual_environment_vm" "ubuntu_vm" {
  name        = "first-vm"
  description = "Managed by Terraform"
  tags        = ["terraform", "ubuntu"]

  node_name = "pve1"
  vm_id     = 4321

  agent {
    enabled = false
  }

  startup {
    order      = "3"
    up_delay   = "60"
    down_delay = "60"
  }

  cpu {
    cores        = 2
    type         = "x86-64-v2-AES"  # recommended for modern CPUs
  }

  memory {
    dedicated = 2048
    floating  = 2048 # set equal to dedicated to enable ballooning
  }

  disk {
    datastore_id = "local-lvm"
    import_from  = proxmox_virtual_environment_download_file.latest_ubuntu_22_jammy_qcow2_img.id
    interface    = "scsi0"
  }

  initialization {
    # uncomment and specify the datastore for cloud-init disk if default `local-lvm` is not available
    datastore_id = "local-lvm"

    ip_config {
      ipv4 {
        address = "dhcp"
      }
    }

    user_account {
      keys     = [trimspace(var.pc_public_key)]
      password = random_password.ubuntu_vm_password.result
      username = "ubuntu"
    }
  }

  network_device {
    bridge = "vmbr0"
  }

resource "random_password" "ubuntu_vm_password" {
  length           = 16
  override_special = "_%@"
  special          = true
}
```

Положим наш ключ в переменные:

Создаём файл `variables.tf` с дополнительной переменной:

```hcl
variable "pc_public_key" {
  description = "Public key for VM's SSH"
  type        = string
  sensitive   = true
}
```

Экспортируем его для безопасной передачи:

```bash
export TF_VAR_pc_public_key=$(cat ~/.ssh/id_rsa.pub) 
```

Проверяем через `terraform plan`, что создается 2 ресурса:
1. ВМ
2. Случайный пароль для пользователя ubuntu

Применяем через `terraform apply`:

![Конфигурация Cloud-init для автоматической настройки VM](/blog/terraform-proxmox/Pasted%20image%2020250915195048.png)

Наша машина готова, но какой же пароль у пользователя Ubuntu? Давайте узнаем:

Создаём файл `output.tf`:

```hcl
output "ubuntu_vm_password" {
  value     = random_password.ubuntu_vm_password.result
  sensitive = true
}
```

Выполним ещё раз `terraform apply` и затем:

```bash
terraform output -raw ubuntu_vm_password
```

Вот и наш пароль!

![Вывод сгенерированного пароля пользователя](/blog/terraform-proxmox/Pasted%20image%2020250915195945.png)

Не рекомендую использовать DHCP в инфраструктуре, но для первой ВМ подойдёт. Найдём её адрес на роутере:

![Тестирование SSH подключения к созданной VM](/blog/terraform-proxmox/Pasted%20image%2020250915200510.png)

И зайдём на неё по SSH:

![Успешное SSH подключение к VM](/blog/terraform-proxmox/Pasted%20image%2020250915200532.png)

Ура, мы внутри! Всё благодаря тому, что мы указали наш публичный SSH-ключ в настройках. Удобно? Я думаю, да!

## Со звёздочкой

Итак, мы умеем создавать ВМ, но выглядит это, откровенно говоря, слишком массивно. Можно ли создавать ВМ значительно компактнее? Для этого нам нужны модули. Давайте напишем свой первый модуль!

> 💡 **Подробнее о создании модулей Terraform** читайте в статье [Создание модулей Terraform](/blog/terrafom-modules/), где я показываю, как создать модуль для автоматического скачивания cloud-образов.

Создадим папку `modules`, а в ней папку `vms` и уже внутри неё 2 файла:

Создаём файл `modules/vms/vms.tf`:
```hcl
terraform {
  required_providers {
    proxmox = {
      source = "bpg/proxmox"
    }
  }
}

resource "proxmox_virtual_environment_vm" "vm" {
  name        = var.vm_name
  tags        = var.tags
  node_name   = var.node_name
  vm_id       = var.vm_id
  boot_order  = ["sata0"]
  description = var.description

  pool_id = var.pool_id

  agent { enabled = true }
  cpu {
    cores = var.cores
    type  = "host"
  }
  memory { dedicated = var.ram }
  startup {
    order    = "2"
    up_delay = "5"
  }
  disk {
    datastore_id = var.datastore_id
    file_id      = var.image_file
    interface    = "sata0"
    size         = var.disk_size
  }
  initialization {
    dns {
      servers = var.dns_servers
    }
    ip_config {
      ipv4 {
        address = var.address
        gateway = var.gateway
      }
    }
    user_account {
      keys     = [trimspace(var.pc_public_key)]
      password = var.vm_password
      username = "root"
    }
  }

  dynamic "usb" {
    for_each = var.usb != null ? [var.usb] : []
    content {
      host    = usb.value.host
      mapping = usb.value.mapping
      usb3    = usb.value.usb3
    }
  }

  network_device { bridge = "vmbr0" }
  operating_system { type = "l26" }
  lifecycle {
    ignore_changes = [
      cpu["architecture"],
      initialization[0].dns[0].servers,
      initialization[0].user_account[0].keys,
    ]
  }
}

output "vm_id" {
  value = proxmox_virtual_environment_vm.vm.id
}
```

и variables.tf
```hcl
variable "vm_name" {
  description = "Name of the VM"
  type        = string
  default     = null
}

variable "node_name" {
  description = "Name of the node where the VM will be created"
  type        = string
  default     = null
}

variable "tags" {
  description = "List of tags to be associated with the VM"
  type        = list(string)
  default     = null
}

variable "vm_id" {
  description = "ID of the VM"
  type        = number
  default     = null
}

variable "cores" {
  description = "Number of CPU cores for the VM"
  type        = number
  default     = null
}

variable "ram" {
  description = "Amount of RAM for the VM"
  type        = number
  default     = null
}

variable "disk_size" {
  description = "Size of the disk for the VM"
  type        = number
  default     = null
}

variable "address" {
  description = "IP address for the VM"
  type        = string
  default     = null
}

variable "pc_public_key" {
  description = "Public key for SSH access"
  type        = string
  default     = null
}

variable "vm_password" {
  description = "Password for the VM"
  type        = string
  default     = null
}

variable "image_file" {
  description = "Path to the image file"
  type        = string
  default     = null
}

variable "pool_id" {
  description = "ID of the pool where the VM will be created"
  type        = string
  default     = null
}

variable "usb" {
  description = "Map a host USB device to a VM"
  type = object({
    host    = string
    mapping = string
    usb3    = bool
  })
  default = null
}

variable "description" {
  description = "Description of the VM"
  type        = string
  default     = null
}

variable "gateway" {
  description = "Gateway IP address for the VM network"
  type        = string
  default     = "10.11.12.52"
}

variable "dns_servers" {
  description = "List of DNS servers for the VM"
  type        = list(string)
  default     = ["10.11.12.170", "10.11.12.52"]
}

variable "datastore_id" {
  description = "Datastore ID for VM disk storage"
  type        = string
  default     = "local-lvm"
}
```
Добавим файл в корень проекта:

Создаём файл `vm_resources.tf`:
```hcl
locals {
  vms_config = yamldecode(file("./configs/vms.yaml"))
}

module "vms" {
  for_each = { for vm in(local.vms_config.vms != null ? local.vms_config.vms : []) : vm.vm_name => vm }
  source   = "./modules/vms"

  vm_name            = each.value.vm_name
  node_name          = try(each.value.node_name, "pve5")
  vm_id              = each.value.vm_id
  cores              = try(each.value.cores, "2")
  ram                = try(each.value.ram, "2048")
  disk_size          = try(each.value.disk_size, 50)
  address            = each.value.address
  tags               = concat(local.vms_config.tags, each.value.tags)
  vm_password        = var.vm_password
  pc_public_key = file("~/.ssh/id_rsa.pub")
  image_file         = try(module.images[each.value.image_name].images[each.value.node_name].id, module.images["ol94"].images[each.value.node_name].id, module.images["ol94"].images["pve5"].id)
  pool_id            = try(each.value.pool_id, null)
  usb                = try(each.value.usb, null)
  description        = try(each.value.description, null)
}
```
Создадим папку `configs` и в ней файл `vms.yaml`:
```yaml
tags:
  - terraform
vms:
  - vm_id: 4322
    vm_name: second-vm
    address: 10.11.12.160/24
    node_name: pve3
    cores: 2
    ram: 2048
    disk_size: 20
    tags: [modules, yaml_config]
    description: "Modules are awesome!"
  - vm_id: 4323
    vm_name: third-vm
    address: 10.11.12.161/24
    node_name: pve4
    cores: 2
    ram: 2048
    disk_size: 20
    tags: [modules, yaml_config]
    description: "Modules are awesome!"
```

После добавления модуля необходимо сделать `terraform init`, чтобы он установил наши модули:

![Инициализация Terraform с модулями](/blog/terraform-proxmox/Pasted%20image%2020250915201551.png)

И попробуем теперь сделать `terraform plan`:

![Планирование развертывания с использованием модулей](/blog/terraform-proxmox/Pasted%20image%2020250915202844.png)

Магия сработала! 

Теперь чтобы создать новую ВМ, нам всего лишь надо добавить её в `vms.yaml` в человекочитаемом формате!

## Домашнее задание

Разберись сам, как работают модули и переделай его так, как будет удобно тебе!

## Итоги

Мы научились инициализировать терраформ с нуля, создавать виртуальные машины, посмотрели, как пишутся модули, и как с их помощью можно сильно улучшить читаемость конфигов.

Все примеры, лежат в этом [репозитории](https://github.com/VizzleTF/proxmox_terraform/tree/main/tf%2Bproxmox.

Мой боевой домашний конфиг с несколькими дополнительными модулями [тут](https://github.com/VizzleTF/home_proxmox/tree/main/terraform_proxmox)
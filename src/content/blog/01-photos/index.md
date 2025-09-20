---
title: "Selfhosted сервис для фотографий"
summary: "Как я выбирал на что перейти с nextcloud в качестве сервиса хранения/синхронизации фотографий"
date: "Sep 13 2025"
draft: false
tags:
  - argocd
  - applications
  - kubernetes
---

## Вступление

В стремлении отказаться от SaaS-сервисов одним из самых главных вопросов является вопрос надежного хранения фотографий. Это самый критичный для меня сервис из всех, что есть в моей домашней лабе.

> 🔗 **Связанные статьи:** Если вас интересует автоматизация инфраструктуры для домашней лабы, рекомендую ознакомиться с моими статьями о [Terraform + Proxmox](/blog/terraform-proxmox/) и [создании модулей Terraform](/blog/terrafom-modules/).

**Исключительно мой опыт ниже, на истинность не претендую**.

Требования к сервису:
1. Наличие автоматической односторонней синхронизации с iphone/android
2. Импорт уже имеющихся фотографий
3. Быстрый доступ к фотографиям с телефона
4. Рабочий поиск по фотографиям, необязателен, но очень желателен
5. Наличие официального helm-чарта, желательно
## Сравнение с конкурентами

Выбирал из следующих:
1. Nextcloud - уже был выбран несколько лет назад, в том числе и для хранения остального
2. Synology photos - отличный инструмент от Synology
3. Seafile - отпал сразу из-за MySQL и отстутствия офф чарта
4. OwnCloud InfiniteScale - тот же некстклауд, только на модном go, а не древнем php - чего еще желать?
5. CloudReve - платная подписка, с которой можно было смириться, если бы не одно "но"
6. Immich - выглядел наиболее перспективно с самого начала

| Платформа                  | Автосинхронизация iPhone/Android                         | Импорт существующих фотографий                   | Быстрый доступ с телефона                          |
| -------------------------- | -------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| **Immich**                 | ✅ Да - фон/активный режим с ограничениями iOS            | ✅ Да - массовый импорт, внешние библиотеки       | 🟡 Хороший - нативное мобильное приложение         |
| **Nextcloud**              | ✅ Да - односторонняя из мобильного приложения            | ✅ Да - через WebDAV, клиент синхронизации        | 🟡 Средний - зависит от производительности сервера |
| **Seafile**                | 🟡 Да - только фото, с проблемами на Android             | ✅ Да - через веб-интерфейс, клиент синхронизации | 🟡 Хороший - оптимизированное мобильное приложение |
| **Synology Photos**        | ✅ Да - автобэкап с мобильного приложения                 | ✅ Да - импорт с локальных дисков, сети           | ✅ Отличный - оптимизация для NAS, кэширование      |
| **iCloud**                 | ✅ Да - нативная интеграция с iOS, веб для Android        | 🟡 Да - импорт из других сервисов ограничен      | ✅ Отличный - нативная интеграция, CDN              |
| **Google Photos**          | ✅ Да - нативная поддержка обеих платформ                 | 🟡 Да - Google Takeout, ограниченный импорт      | ✅ Отличный - глобальная CDN, оптимизация           |
| **CloudReve**              | ✅ Да - автобэкап фотографий через iOS/Android приложения | ✅ Да - через веб-интерфейс, batch upload         | 🟡 Хороший - быстрые загрузки, thumbnail генерация |
| **ownCloud InfiniteScale** | ✅ Да - через мобильное приложение ownCloud               | ✅ Да - через Spaces, WebDAV, массовые операции   | 🟡 Средний - зависит от конфигурации кластера      |
Увы, не влезло по ширине для импорта в pdf

| Платформа                  | Поиск по содержимому                            | Официальный Helm Chart                  |
| -------------------------- | ----------------------------------------------- | --------------------------------------- |
| **Immich**                 | ✅ Отличный - AI CLIP, лица, объекты, метаданные | ✅ Да - immich-app/immich-charts         |
| **Nextcloud**              | 🟡 Хороший - с Recognize/Memories, теги         | ✅ Да - nextcloud/helm                   |
| **Seafile**                | ❌ Нет - только по метаданным и именам файлов    | ❌ Нет - только Docker/manual            |
| **Synology Photos**        | 🟡 Базовый - лица, метаданные, места            | ❌ Нет - только для Synology DSM         |
| **iCloud**                 | 🟡 Базовый - лица, места, простые объекты       | ❌ Нет - облачный сервис                 |
| **Google Photos**          | ✅ Отличный - продвинутый AI, контекстный поиск  | ❌ Нет - облачный сервис                 |
| **CloudReve**              | 🟡 Базовый - поиск по метаданным EXIF, теги     | 🟡 Частично - community charts доступны |
| **ownCloud InfiniteScale** | 🟡 Базовый - полнотекстовый поиск, метаданные   | ✅ Да - owncloud/ocis-charts             |
Но это на бумаге, что на деле?
## Результаты тестирования

1. **Nextcloud**
	 Плюсы:
	- Не только фото
	- Наличие клиентов на телефоны и синхронизации
	- Большое комьюнити
	- Наличие официального и поддерживаемого helm чарта
	 Минусы:
	- Ужасно медленный клиент
	- Синхронизация не всегда работает в фоне на айфоне
	- Сомнительные векторы развития продукта (в гипермегавсемогущий комбайн)
	 
	 Вывод: если хочется иметь личное облако с кучей возможностей - лучший выбор. Но для фото, варианты ниже будут лучше. Поэтому остается у меня для всего, кроме фото
2. **Seafile** - единственный инструмент, который я не развернул и не использовал из списка, т.к. отбраковал на первоначальном этапе
3. **CloudReve** - переспективный инструмент, развернул без проблем, оформил подписку, включил синхронизацию, но ничего не произошло - ни одна фотография не синхронизировалась с сервером с айфона, как бы я ни старался и что бы не делал. За деньги? - нет.
4. **OwnCloud InfiniteScale** - helm чарту 7 лет, потратил много времени на то, чтобы развернуть, но все таки развернул свежую версию. В итоге 30 нерабочих микросервисов, интерфейс корявый, супер производительности относительно nextcloud'a замечено не было.
5. **Synology Photos** - один из самых лучших вариантов и, наверное, лучший для большинства. Ставится в одну кнопку на Synology/Xpenology NAS, замечательное быстрое приложение с лучшей синхронизацией в фоне! Мне не подходит только по причине того, что NAS у меня для бекапов, а не для сервисов. Уступает immich только в плане возможностей поиска по фотографиям.
6. **Immich** - пришлось немного пострадать, но по итогу мой конечный вариант:
	 Плюсы:
	- Относительно понятный helm chart
	- Отличное быстродействие приложения
	- Простой и приятный интерфейс с удобным таймлайном фото
	- 1 инструмент - 1 задача (у меня такое привествуется, не люблю комбайны)
	- Понятно как резервировать (БД + папка с фото)
	- Отличный поиск по фото по-русски (через нейросеть в комплекте)
	- Рабочая синхронизация фотографий с айфона (иногда застревает, но терпимо)
	- Возможность правки exif через веб, в том числе и массовой
	 Минусы:
	 - Дефолтная тег образа в чарте - образ годовалой давности
	 - Необходимость использования `existingClaim` для основной PVC 
	 - Если удалить фото из приложения - в следующую синхронизацию оно вернется обратно (я не чищу библиотеку на айфоне, а вот хранить по 3-2-1 скриншоты мне бы не хотелось. Видимо придется менять привычки)

## Сложности

У меня не все фотографии имели exif дату (больше тысячи), из-за этого Synology Photos и Immich распологали их датой синхронизации на таймлайне, что портило весь опыт использования. И так как руками перебрать их было бы слишко времязатратно, а многие из них либо имели дату в названии, либо были разложены по папкам `год\месяц` был написан скрипт, ссылки: [скрипт](https://github.com/VizzleTF/home_proxmox/raw/refs/heads/main/scripts/fix_exif_dates_new.sh)  и [логика](https://github.com/VizzleTF/home_proxmox/blob/main/scripts/exif_script_logic.md). 
Основная часть была обработана этим скриптом, десяток оставшихся был обработан прям через веб immich - отлично, что в нем есть такой функционал.

## Вывод

Я рад, что спустя 3 года использования nextcloud смог найти более подходящее приложение для хранения фотографий. Immich оказался замечательным вариантов для меня, но большинству я все же советую присмотреться к **Synology Photos**.

## Deploy

Задеплоен immich как и все мои приложения через argocd app c cnpg базой данных и longhorn в качестве storage:

app:
```yaml
## ArgoCD Application для Immich

apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: immich
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  sources:
    # Helm chart from public repository
    - repoURL: https://immich-app.github.io/immich-charts
      chart: immich
      targetRevision: "*"  # Use latest version for automatic updates
      helm:
        valueFiles:
          - $values/applications/immich.yaml

    - repoURL: https://cloudnative-pg.github.io/charts
      targetRevision: "*"
      chart: cluster
      helm:
        valueFiles:
          - $values/applications/cnpg-immich-db.yaml
    # Values repository
    - repoURL: git@github.com:VizzleTF/home-proxmox-values.git
      targetRevision: HEAD
      ref: values
    # Additional manifests
    - repoURL: git@github.com:VizzleTF/home-proxmox-values.git
      path: manifests/immich
      targetRevision: HEAD
  destination:
    server: https://kubernetes.default.svc
    namespace: immich
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - RespectIgnoreDifferences=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```
values:
```yaml
# Immich Self-hosted Photo and Video Backup Solution
# Configuration for HomeLab deployment with CNPG PostgreSQL

_shared_config:
  hostname: &hostname immich.example.com
  url: &url https://immich.example.com

image:
  tag: v1.141.1
  
# Environment variables for database connection
env:
  # PostgreSQL connection via CNPG
  DB_HOSTNAME: "immich-cluster-rw"
  DB_PORT: "5432"
  DB_DATABASE_NAME: "immich"
  DB_USERNAME:
    valueFrom:
      secretKeyRef:
        name: immich-db-credentials
        key: username
  DB_PASSWORD:
    valueFrom:
      secretKeyRef:
        name: immich-db-credentials
        key: password
  # Redis connection (will be enabled as dependency)
  REDIS_HOSTNAME: "immich-redis-master"
  # Machine Learning service URL
  IMMICH_MACHINE_LEARNING_URL: "http://immich-machine-learning:3003"
  # Server URL
  IMMICH_SERVER_URL: *url
  PUBLIC_IMMICH_SERVER_URL: *url

# Immich configuration
immich:
  persistence:
    # Main library storage for photos and videos - 50GB as requested
    library:
      existingClaim: "immich-library-pvc"

# Dependencies - disable built-in PostgreSQL, use CNPG instead
postgresql:
  enabled: false

# Enable Redis for caching
redis:
  enabled: true
  architecture: standalone
  auth:
    enabled: false
  master:
    persistence:
      enabled: true
      storageClass: "longhorn"
      size: 1Gi

# Server component configuration
server:
  enabled: true
  resources:
    requests:
      cpu: "1"
      memory: "2Gi"
    limits:
      cpu: "3"
      memory: "6Gi"
  image:
    repository: ghcr.io/immich-app/immich-server
    pullPolicy: IfNotPresent
  
  # Ingress configuration
  ingress:
    main:
      enabled: true
      className: "nginx"
      annotations:
        cert-manager.io/cluster-issuer: "cloudflare-issuer"
        kubernetes.io/tls-acme: "true"
        nginx.ingress.kubernetes.io/ssl-redirect: "true"
        nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
        external-dns.alpha.kubernetes.io/target: "XX.XX.XX.XX"
        # Important: Remove body size limit for photo/video uploads
        nginx.ingress.kubernetes.io/proxy-body-size: "0"
        nginx.ingress.kubernetes.io/client-max-body-size: "0"
      hosts:
        - host: *hostname
          paths:
            - path: "/"
              pathType: Prefix
      tls:
        - hosts:
            - *hostname
          secretName: immich-tls

# Machine Learning component
machine-learning:
  enabled: true
  resources:
    requests:
      cpu: "1"
      memory: "2Gi"
    limits:
      cpu: "3"
      memory: "6Gi"
  image:
    repository: ghcr.io/immich-app/immich-machine-learning
    pullPolicy: IfNotPresent
  env:
    TRANSFORMERS_CACHE: /cache
  # Health check configuration
  probes:
    liveness:
      enabled: true
      spec:
        periodSeconds: 30
        failureThreshold: 20
    readiness:
      enabled: true
      spec:
        periodSeconds: 30
        failureThreshold: 20
  persistence:
    cache:
      enabled: true
      size: 10Gi
      type: pvc
      storageClass: "longhorn"
      accessMode: ReadWriteMany
      retain: true
```
manifests:
pvc:
```yaml
# PVC for Immich photo and video library storage
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: immich-library-pvc
  namespace: immich
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: longhorn-retain
  volumeMode: Filesystem
  resources:
    requests:
      storage: 150Gi
```
backup_cronjob:
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-immich-library
  namespace: immich
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: sync
            image: instrumentisto/rsync-ssh
            command: ["rsync", "-avz", "--no-owner", "--no-group", "--no-times", "--delete", "/source/", "/destination/"]
            volumeMounts:
            - name: immich-library-volume
              mountPath: /source
            - name: nfs-volume
              mountPath: /destination
          restartPolicy: OnFailure
          volumes:
          - name: immich-library-volume
            persistentVolumeClaim:
              claimName: immich-library-pvc
          - name: nfs-volume
            nfs:
              server: 10.11.12.223
              path: "/volume5/k8s_svc/immich"
```
database:
```yaml
# Database манифест для Immich приложения
# Пароли пользователей управляются через External Secrets из Vault
# См. database-users-external-secret.yaml

apiVersion: postgresql.cnpg.io/v1
kind: Database
metadata:
  name: immich
  namespace: immich
spec:
  name: immich
  owner: immich_user
  cluster:
    name: immich-cluster
  extensions:
    - name: vector
      ensure: present
    - name: cube
      ensure: present
    - name: earthdistance
      ensure: present
  ensure: present
```
database-users-external-secret:
```yaml
# External Secret для доступа к базе данных Immich из namespace immich
# Получает данные из Vault и создает секрет immich-db-credentials

apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: immich-database-credentials
  namespace: immich
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend-cluster
    kind: ClusterSecretStore
  target:
    name: immich-db-credentials
    creationPolicy: Owner
    template:
      type: Opaque
      data:
        username: "{{ .username }}"
        password: "{{ .password }}"
  data:
    - secretKey: username
      remoteRef:
        key: homelab/k8s/immich/main-database
        property: username
        conversionStrategy: Default
        decodingStrategy: None
        metadataPolicy: None
    - secretKey: password
      remoteRef:
        key: homelab/k8s/immich/main-database
        property: password
        conversionStrategy: Default
        decodingStrategy: None
        metadataPolicy: None
```

## Заключение

Immich оказался отличным решением для замены коммерческих сервисов хранения фотографий. Быстрая синхронизация, качественный поиск и активное развитие делают его идеальным выбором для домашней лабы.

> 🚀 **Следующие шаги:** Для автоматизации развертывания подобных сервисов рекомендую изучить [Terraform + Proxmox](/blog/terraform-proxmox/) для управления виртуальными машинами и [создание модулей Terraform](/blog/terrafom-modules/) для переиспользуемых компонентов инфраструктуры.
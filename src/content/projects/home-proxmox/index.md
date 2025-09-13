---
title: "Home Proxmox"
summary: "Infrastructure as Code для домашней лаборатории, построенной на Proxmox с Kubernetes кластером, автоматизированными развертываниями и комплексным мониторингом."
date: "Sep 10 2023"
draft: false
tags:
- Infrastructure as Code
- Proxmox
- Kubernetes
- Docker
- Terraform
- Ansible
demoUrl: https://github.com/vizzletf/home-proxmox
repoUrl: https://github.com/vizzletf/home-proxmox
---

Home Proxmox — это комплексное решение Infrastructure as Code для построения и управления домашней лабораторной средой. Построенное на платформе виртуализации Proxmox, оно обеспечивает автоматизированное развертывание Kubernetes кластеров с интегрированными инструментами мониторинга и управления.

Проект реализует принципы GitOps с автоматизированными развертываниями, управлением конфигурацией через Ansible и провизионированием инфраструктуры через Terraform. Он включает комплексный стек мониторинга с Prometheus, Grafana и AlertManager для полной наблюдаемости.

Ключевые компоненты включают настройку Proxmox кластера, автоматизацию развертывания Kubernetes, CI/CD пайплайны, системы мониторинга и оповещений, стратегии резервного копирования и конфигурацию сети. Вся инфраструктура контролируется версиями и воспроизводима.
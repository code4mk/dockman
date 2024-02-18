#!/bin/bash

colima start \
    --cpu 1 \
    --disk 100 \
    --memory 8 \
    --mount-type virtiofs \
    --vm-type vz \
    --network-address \
    --env COLIMA_IP=192.168.106.201

#!/bin/bash

$RETOUR = ps aux | grep -v grep | grep 'mongo'| wc -l

echo $RETOUR

 

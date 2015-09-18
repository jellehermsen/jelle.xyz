#!/bin/bash
rm -rf website/*
hasclunk build
rm -rf ~/public_html/*
rm -rf website/posts/
rm -rf website/categories/
cp -R website/* ~/public_html/
cabal clean

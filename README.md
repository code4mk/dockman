# dockman

```bash
#Delete local tags.
git tag -d $(git tag -l)
#Fetch remote tags.
git fetch
#Delete remote tags.
git push origin --delete $(git tag -l) # Pushing once should be faster than multiple times
#Delete local tags.
git tag -d $(git tag -l)
```

* https://github.com/svenstaro/upload-release-action


# authorize issue

```bash
xattr -cr /Applications/dockman.app
```

# flask db migration
* https://chatgpt.com/c/4c5a0a0c-5377-4499-8723-df2996c3216b
* https://chatgpt.com/c/f3afdf1a-1ce1-4dc4-a2ff-60445573b9ec


```bash
flask db init
flask db migrate -m "Initial migration."
flask db upgrade

flask db revision --rev-id e1c9f2b4d9c7 
```
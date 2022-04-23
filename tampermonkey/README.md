# GitHub Remark - Tampermonkey - a local version
> This is a local version of [GithubRemark](https://github.com/dpy1123/GithubRemark) based on Tampermonkey.

This script offers the ability to set a remark for any people you see on GitHub, whether you follow them or not.

# Usage
For any user you have not remarked, the default remark "not set" will be displayed after his nickname.
If you want to change the remark, you can simply double-click on the current remark and enter a new one in the input dialog.

![](../images/Remark%20setting.jpg)

# Features
This script has the following features:
- Multi-page support. Supported pages include Homepage, Repositories, and Organization.
- Multi-account support. You can log in to multiple accounts, and the remark will not be confused.
- Security. No internet is required, and no information will be transmitted to any server. 


# Backup and restore
This script uses localStorage to cache all the remarks using the key "**GithubRemark-cache**". 

So if you want to backup or restore all the remarks on the computer, you can just open the development mode of your browser, and find the cache in the localStorage according to the key "**GithubRemark-cache**".


# Original Author -  [DD](https://github.com/dpy1123)

# Modified by - [Dorad](https://github.com/Doradx)
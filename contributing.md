# Using Github, Github.app and MODX Cloud to work on the `a11y` Manager Theme

## Requirements

The following setup guide was creaeted in order to help collaborate on the a11y project using Github, the desktop Github app, and MODX Cloud as a test environment. It also requires some basic familiarity with using the command line tools via SSH or Putty. A basic working knowledge of those four tools is required to successfully use this guide.

## Set-up Instructions

1. First, fork the MODX a11y project into your own repo. For example: fake-example/a11y (http://github.com/fake-example/a11y)

2. Make a note of the `fake-example/a11y` part of your fork from step 1. You must use your own fork URL, not the "fake-example" noted here.

3. Next, create a new Cloud instance using the latest version of MODX in your MODX Cloud account.

4. SSH into your MODX Cloud instance. From the command line execute the followng commands, and replacing "fake-example" with your actual fork location:

  ```
  mkdir www/packages; cd www/packages
  git clone https://github.com/theboxer/Git-Package-Management.git ./gpm
  git clone https://github.com/fake-example/a11y.git ./a11y
  wget http://getcomposer.org/composer.phar
  cd gpm/cli
  php ../../composer.phar install
  cd bin
  ```
  The above steps should pull down and install Git Package Management (GPM), your fork of the a11y project, and install GPM which is what you will use to install and update the a11y project from the remote Git repository.

5. Make a note of the path on your command like. For example in cloud you would see something like `/paas/c9999/www/packages/gpm/cli/bin `. Enter the following command, replacing the relevant part of the path with your local equivalent:

  ```
  ./gpm gpm:install --dir=gpm --packagesDir=/paas/c9999/www/packages/ --packagesBaseUrl=/packages/ --corePath=/paas/c9999/www/core/
  ```

6. Go to the MODX Manager and clear the cache using the `Manage > Clear Cache` menu. After you clear the cache you should see GPM under th Extras menu.

7. Next we'll set up the a11y theme to work with GPM:

  ```
  cd /www/manager/controllers
  ln -s ../../packages/a11y/manager/controllers/a11y ./a11y
  ls
  ```
  
  You should see `default` and `a11y` listed.
  
  ```
  cd ../templates
  ln -s ../../packages/a11y/manager/templates/a11y ./a11y
  ```
  
  Again, you should see `default` and `a11y` listed.
  
  ```
  cd /www/packages/gpm/cli/bin
  ./gpm package:install --dir=a11y
  ```

8. These following steps are done automatically when installing from a transport package, but are required to be done manually when installing via GPM. First, go to the MODX Manager, clear the cache and refresh the page. 

9. In the Manager, go to the `Settings (gear icon) > Dashboard Settings` menu. Add to the default dashboard all a11y widgets. Don't forge to press the green save button at the top-right.

10. In your system settings, switch the Manager theme to `a11y`, and visit the main Dashboard Page. You should be working in a new theme in the MODX Manager.

## Navigating the MODX Manager with your Keyboard

Generally speaking any specific area of the Manager is navigated by pressing tab to navigate between items, like when editing content of a Resource.

To move between main areas of he Manager itself, see the section below.

### Main Areas

On Mac, cmd-F6 will cycle between the Top Navbar, the left Tree Menus and the Main Content area. It is used to skip between areas quickly. You may have to use the function (`fn`) key on laptops in addition, so you would press `fn-cmd-F6`, depending on your Mac OS X keyboard system settings preferences.

On Windows, you use `control-F6` for the same functions.

### Tree Menu

Once you have the left Tree Menu area focused, as indicated by the green outline, press the `tab-key   to cycle through the Resources, Elements and Files tree menus (aka, tree widgets). 

Once you have focused a Tree Menu, use the arrow keys to navigate the individual nodes. Press enter to start editing a node.

To use the context menu associated with any tree node, use `cmd-F10` on Mac, or `ctrl-F10` on other platforms. Use the arrow keys to navigate the context menu, press `enter` on a highlighted menu option to select it, or press the `esc` key to dismiss the context menu.

### Tabbed Menus on Resources

TBD

### Other Keyboard Shortcuts

* Save a Resource: `cmd-S` or `ctrl-S`
* Clear the Cache: `cmd-T` or `ctrl-T`
* _Others TBD_

## Contributing Code to the `a11y` Theme 

### Working with Your Repo

You should be testng and working in your local Repo. It is usually preferred to work locally, using your favorte text editor to edit files and the Github.app to sync them back to your Github Repository.

### The a11y Theme file layout

The following section outlines the purpose of each directory and some key files in the a11y theme.

#### Folders 
TBD

#### Key Files 
TBD

### Updatng Your Theme

To update the a11y theme from your fork, login to your MODX Cloud test project via SSH, then issue the following command:

```
cd www/packages/a11y
git pull
```

You can just leave the terminal session open, and use `git pull` as needed.

### Submitting Changes Back to the Main Repo

1. Test locally to confirm its working
2. From Github.app, press the Submit Pull Request (PR) back to the main Master Branch. Give it a descriptive title and supply addtional information in the description. 
3. You should see your PR here if it was successful: https://github.com/modxcms/a11y/pulls


## Contributing Styling Updates to the `a11y` Theme 

Instructsions for configuring Sass and how to edit it TBD.

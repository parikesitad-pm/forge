import { application } from 'controllers/application';

import HelloController from 'controllers/hello_controller';
application.register('hello', HelloController);

import PasswordController from 'controllers/password_controller';
application.register('password', PasswordController);

import ProfileMenuController from 'controllers/profile_menu_controller';
application.register('profile-menu', ProfileMenuController);

import SidebarController from 'controllers/sidebar_controller';
application.register('sidebar', SidebarController);

import ThemeController from 'controllers/theme_controller';
application.register('theme', ThemeController);

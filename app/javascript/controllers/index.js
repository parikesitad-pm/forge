import { application } from 'controllers/application';

import HelloController from 'controllers/hello_controller';
application.register('hello', HelloController);

import PasswordController from 'controllers/password_controller';
application.register('password', PasswordController);

import SidebarController from 'controllers/sidebar_controller';
application.register('sidebar', SidebarController);

import ThemeController from 'controllers/theme_controller';
application.register('theme', ThemeController);

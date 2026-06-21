import { application } from './application';

import HelloController from './hello_controller';
application.register('hello', HelloController);

import PasswordController from './password_controller';
application.register('password', PasswordController);

import SidebarController from './sidebar_controller';
application.register('sidebar', SidebarController);

import ThemeController from './theme_controller';
application.register('theme', ThemeController);

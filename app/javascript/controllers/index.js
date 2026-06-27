import { application } from 'controllers/application';

// === Hello =====
import HelloController from 'controllers/hello_controller';
application.register('hello', HelloController);

// === Password =====
import PasswordController from 'controllers/password_controller';
application.register('password', PasswordController);

// === Profile Menu =====
import ProfileMenuController from 'controllers/profile_menu_controller';
application.register('profile-menu', ProfileMenuController);

// === Sidebar =====
import SidebarController from 'controllers/sidebar_controller';
application.register('sidebar', SidebarController);

// === Theme =====
import ThemeController from 'controllers/theme_controller';
application.register('theme', ThemeController);

// ===== Confirmation Modal =====

import ConfirmModalController from 'controllers/confirm_modal_controller';
application.register('confirm-modal', ConfirmModalController);

// ==== Composer =====
import ComposerController from 'controllers/composer_controller';
application.register('composer', ComposerController);

// === Copy =====
import CopyController from 'controllers/copy_controller';
application.register('copy', CopyController);

// === Toast =====
import ToastController from 'controllers/toast_controller';
application.register('toast', ToastController);

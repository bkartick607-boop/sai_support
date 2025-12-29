// Header.tsx
import * as React from 'react';
import {
  Avatar,
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
  Text,
  tokens,
} from '@fluentui/react-components';
import {
  WeatherMoon24Regular,
  WeatherSunny24Regular,
  SignOut24Regular,
  Person24Regular,
  Question24Regular,
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

import '@/styles/Header.css';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const avatarLabel =
    (user?.name ? `User avatar: ${user.name}` : undefined) ??
    (user?.email ? `User avatar: ${user.email}` : 'User avatar');

  const showMoon = themeMode === 'light';
  const themeToggleLabel =
    themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <header className="app-header app-header-surface" data-theme={themeMode}>
      {/* Left section: title only */}
      <div className="header-left">
        <div
          className="header-logo"
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          aria-label="Go to home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') navigate('/');
          }}
        >
          <Text weight="semibold" size={500} className="header-title">
            UCMP Segmentation Agent
          </Text>
        </div>
      </div>

      {/* Right section: theme toggle, help, profile menu */}
      <div className="header-right">
        <Tooltip content={themeToggleLabel} relationship="label">
          <Button
            appearance="subtle"
            icon={showMoon ? <WeatherMoon24Regular /> : <WeatherSunny24Regular />}
            onClick={toggleTheme}
            aria-label={themeToggleLabel}
          />
        </Tooltip>

        <Tooltip content="Help and About" relationship="label">
          <Button
            appearance="subtle"
            icon={<Question24Regular />}
            onClick={() => navigate('/about')}
            aria-label="Help and About"
          />
        </Tooltip>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="subtle"
              className="profile-button"
              aria-label="User profile menu"
              icon={
                <Avatar
                  name={user?.name || user?.email || 'User'}
                  initials={user?.initials}
                  color="brand"
                  size={32}
                  aria-label={avatarLabel}
                />
              }
            />
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem icon={<Person24Regular />} disabled>
                <div className="profile-menu-info">
                  <Text weight="semibold">
                    {user?.name || 'User'}
                  </Text>
                  {user?.email && (
                    <Text size={200} className="profile-email">
                      {user.email}
                    </Text>
                  )}
                </div>
              </MenuItem>

              <MenuDivider />

              <MenuItem icon={<SignOut24Regular />} onClick={logout}>
                Sign Out
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </header>
  );
};
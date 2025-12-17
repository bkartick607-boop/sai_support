import React from 'react';
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

  return (
    <header className="app-header app-header-surface">
      <div className="header-left">
        <div className="header-logo" onClick={() => navigate('/')}>
          <svg width="32" height="32" viewBox="0 0 100 100">
            <rect width="100" height="100" rx="18" fill={tokens.colorBrandBackground} />
            <text
              x="50"
              y="65"
              fontSize="48"
              textAnchor="middle"
              fill="white"
              fontFamily="Segoe UI, sans-serif"
              fontWeight="bold"
            >
              AI
            </text>
          </svg>
          <Text weight="semibold" size={500} className="header-title">
            UCMP Segmentation Agent
          </Text>
        </div>
      </div>

      <div className="header-right">
        <Tooltip content={themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          <Button
            appearance="subtle"
            icon={themeMode === 'light' ? <WeatherMoon24Regular /> : <WeatherSunny24Regular />}
            onClick={toggleTheme}
          />
        </Tooltip>

        <Tooltip content="About">
          <Button
            appearance="subtle"
            icon={<Question24Regular />}
            onClick={() => navigate('/about')}
          />
        </Tooltip>

        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="subtle" className="profile-button">
              <Avatar
                name={user?.name || user?.email || 'User'}
                initials={user?.initials}
                color="brand"
                size={32}
              />
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem icon={<Person24Regular />} disabled>
                <div className="profile-menu-info">
                  <Text weight="semibold">{user?.name || 'User'}</Text>
                  <Text size={200} className="profile-email">
                    {user?.email}
                  </Text>
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

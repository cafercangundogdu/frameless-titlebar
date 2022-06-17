import React, { Fragment, useState, useCallback } from 'react';
import cx from 'classnames';
import WindowControls from './window-controls';
import MenuBar from './menu-bar';
import useWindowFocus from './effects/useWindowFocus';
import styles from './style.css';
import { useTheme, ThemeContext } from './theme';
import Title from './components/title';
import Bar from './components/bar';
import { TitleBarProps } from './typings';
import Logo from './components/logo';

const TitleBar = ({
  onMinimize,
  onMaximize,
  onClose,
  onDoubleClick,
  className,
  disableMaximize,
  disableMinimize,
  hideControls,
  platform,
  children,
  theme,
  menu,
  icon,
  iconSrc,
  title,
  maximized,
  currentWindow
}: TitleBarProps) => {
  const focused = useWindowFocus();
  const currentTheme = useTheme(theme, platform);
  const [hovering, setHovering] = useState(false);
  const isDarwin = platform === 'darwin';
  const stacked = currentTheme?.menu?.style === 'stacked';
  const vertical = currentTheme?.menu?.style === 'vertical';
  const controlsRight = currentTheme?.controls?.layout === 'right';
  const hasIcon = !!icon || !!iconSrc;
  const hasMenu = !isDarwin && ((menu?.length ?? 0) > 0);
  const hasTitle = !!(title && title !== '');
  const onHover = useCallback((hovering: boolean) => {
    setHovering(hovering);
  }, [setHovering]);
  return (
    <ThemeContext.Provider value={currentTheme}>
      <Fragment>
        <Bar onDoubleClick={onDoubleClick} className={className} onHover={onHover}>
          <div className={cx(styles.ResizeHandle, styles.Top)} />
          <div className={cx(styles.ResizeHandle, styles.Left)} style={{ height: theme?.bar?.height }} />
          {!isDarwin && !controlsRight && (
            <WindowControls
              hideControls={hideControls}
              focused={focused}
              disableMaximize={disableMaximize}
              disableMinimize={disableMinimize}
              maximized={maximized}
              onMinimize={onMinimize}
              onMaximize={onMaximize}
              onClose={onClose}
            />
          )}
          {
            !vertical && hasIcon && <Logo src={iconSrc} hasTitle={hasTitle}>{icon}</Logo>
          }
          {!isDarwin && !stacked && hasMenu && (
            <MenuBar
              focused={focused}
              menu={menu}
              currentWindow={currentWindow}
              hovering={hovering}
            />
          )}
          {
            vertical && hasIcon && <Logo src={iconSrc} hasTitle={hasTitle}>{icon}</Logo>
          }
          <Title
            focused={focused}
            hasIcon={hasIcon}
            hasMenu={hasMenu}
          >
            {title}
          </Title>
          {children}
          {!isDarwin && controlsRight && (
            <WindowControls
              hideControls={hideControls}
              focused={focused}
              disableMaximize={disableMaximize}
              disableMinimize={disableMinimize}
              maximized={maximized}
              onMinimize={onMinimize}
              onMaximize={onMaximize}
              onClose={onClose}
            />
          )}
        </Bar>
        {!isDarwin && stacked && (
          <Bar bottomBar>
            {
              hasMenu &&
              <MenuBar
                focused={focused}
                menu={menu}
                currentWindow={currentWindow}
                hovering={hovering}
              />
            }
          </Bar>
        )}
      </Fragment>
    </ThemeContext.Provider>
  );
};

export default TitleBar;

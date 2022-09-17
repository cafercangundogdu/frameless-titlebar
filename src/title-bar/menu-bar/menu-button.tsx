import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ThemeContext } from "../theme";
import MenuList from "./menu-list";
import {
  currentSelected,
  isItemSubMenu,
  splitLabel,
  SplitLabel,
} from "../utils";
import styles from "../style.css";
import {
  MenuButtonProps,
  FullMenuBottonProps,
  MenuButtonTheme,
} from "../typings";
import Button from "../components/button";

const useAltLabel = (l?: string): SplitLabel => {
  const [label, setLabel] = useState(splitLabel(l));

  useEffect(() => {
    setLabel(splitLabel(l));
  }, [l]);

  return label;
};

const MenuButton = ({
  focused,
  currentWindow,
  item,
  altKey,
  myRef,
  style,
  idx,
  depth,
  selectedPath,
  dispatch,
  icon,
}: FullMenuBottonProps) => {
  const theme = useContext(ThemeContext);
  const label = useAltLabel(item.label);
  const onClose = useCallback(() => {
    if (myRef.current) {
      myRef.current.blur();
    }
    dispatch({ type: "set", depth, selected: -1 });
  }, [myRef.current]);

  const onClick = useCallback(() => {
    if (!item.disabled) {
      dispatch({ type: "button-set", depth, selected: idx });
    }
  }, [idx, item.disabled]);

  const onHover = useCallback(
    (hovering: boolean) => {
      dispatch({ type: "hovering", hovering });
      if (currentSelected(selectedPath, depth) >= 0 && hovering) {
        onClick();
      }
    },
    [myRef.current, selectedPath, depth, onClick]
  );

  const selected = currentSelected(selectedPath, depth) === idx;
  const isSubMenu = isItemSubMenu(item);
  const open: boolean = !(item?.disabled ?? false) && isSubMenu && selected;
  const textDecoration = !item.disabled && altKey ? "underline" : "none";

  return (
    <Button
      ref={myRef}
      disabled={item.disabled ?? false}
      open={open}
      theme={{ ...(theme.bar.button as Required<MenuButtonTheme>) }}
      focused={focused}
      style={style}
      inactiveOpacity={theme.bar.inActiveOpacity!}
      onClick={onClick}
      ariaLabel={item.label?.replace("&", "")}
      label={
        icon ?? (
          <Fragment>
            <span className={styles.MenuButtonLabel} aria-hidden="true">
              {label.before}
            </span>
            <span
              className={styles.MenuButtonLabel}
              style={{
                textDecoration,
              }}
              aria-hidden="true"
            >
              {label.letter}
            </span>
            <span className={styles.MenuButtonLabel} aria-hidden="true">
              {label.after}
            </span>
          </Fragment>
        )
      }
      onOverlayClick={onClose}
      onHover={onHover}
    >
      <MenuList
        key={depth}
        menu={item.submenu ?? []}
        ref={myRef}
        currentWindow={currentWindow}
        depth={depth + 1}
        selectedPath={selectedPath}
        dispatch={dispatch}
      />
    </Button>
  );
};

export default React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  (props, ref) => {
    return (
      <MenuButton
        {...props}
        myRef={ref as React.RefObject<HTMLButtonElement>}
      />
    );
  }
);

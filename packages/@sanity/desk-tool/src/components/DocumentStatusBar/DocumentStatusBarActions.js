import PropTypes from 'prop-types'
import React from 'react'
import ChevronDownIcon from 'part:@sanity/base/chevron-down-icon'
import Button from 'part:@sanity/components/buttons/default'

import styles from './DocumentStatusBarActions.css'

class DocumentStatusBarActions extends React.PureComponent {
  static propTypes = {
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.oneOf(['primary', 'success', 'danger', 'white', 'warning']),
        disabled: PropTypes.bool,
        handleClick: PropTypes.func,
        icon: PropTypes.func,
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired,
    idPrefix: PropTypes.string.isRequired,
    isDisconnected: PropTypes.bool
  }

  static defaultProps = {
    isDisconnected: false
  }

  state = {
    focusedMenuItemIdx: -1,
    isMenuOpen: false
  }

  actionsDropDownButtonRef = React.createRef()
  menuElementRef = React.createRef()

  componentDidMount() {
    // NOTE: used to capture clicks outside menu
    window.addEventListener('click', this.handleWindowClick)
  }

  componentWillUnmount() {
    // NOTE: used to capture clicks outside menu
    window.removeEventListener('click', this.handleWindowClick)
  }

  handleDropDownButtonClick = event => {
    // prevent the global click handler from handling this event
    event.stopPropagation()

    // toggle the menu
    this.setState(state => {
      return {focusedMenuItemIdx: -1, isMenuOpen: !state.isMenuOpen}
    })
  }

  handleWindowClick = event => {
    if (this.state.isMenuOpen) {
      const clickMenuElement = event.target.closest('[data-menu="true"]')
      if (clickMenuElement && clickMenuElement === this.menuElementRef.current) {
        // clicked within menu
        // do nothing
      } else {
        // clicked outside of menu
        this.setState(state => ({focusedMenuItemIdx: -1, isMenuOpen: false}))
      }
    }
  }

  handleActionClick = (event, action) => {
    if (action.handleClick) {
      action.handleClick(event)
    }

    // hide menu
    this.setState(state => ({focusedMenuItemIdx: -1, isMenuOpen: false}))
  }

  // eslint-disable-next-line complexity
  handleDropDownKeyDown = event => {
    // Space or Enter opens `role=menu` and moves focus to first `role=menuitem`
    if (!this.state.isMenuOpen && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      const menuElement = this.menuElementRef.current
      if (!menuElement) return
      const focusedMenuItemIdx = this.getNextFocusableMenuItemIdx()
      const focusedMenuItem = menuElement.childNodes[focusedMenuItemIdx]
      if (focusedMenuItem && focusedMenuItem.firstChild) {
        this.setState(state => ({focusedMenuItemIdx, isMenuOpen: true}))
        setTimeout(() => {
          focusedMenuItem.firstChild.focus()
        }, 0)
      }
      return
    }

    // Esc should close the menu and focus the button
    if (event.key === 'Escape') {
      this.setState({isMenuOpen: false})
      this.focusDropDownButton()
      return
    }

    // Space or Enter should focus the button after the menu is closed
    if (event.key === 'Enter' || event.key === ' ') {
      this.focusDropDownButton()
      return
    }

    // Up Arrow opens `role=menu` and moves focus to last `role=menuitem`
    if (event.key === 'ArrowUp') {
      const menuElement = this.menuElementRef.current
      if (!menuElement) return
      const focusedMenuItemIdx = this.getPreviousFocusableMenuItemIdx()
      const focusedMenuItem = menuElement.childNodes[focusedMenuItemIdx]
      if (focusedMenuItem && focusedMenuItem.firstChild) {
        this.setState(state => ({focusedMenuItemIdx, isMenuOpen: true}))
        setTimeout(() => {
          focusedMenuItem.firstChild.focus()
        }, 0)
      }
    }

    // Down Arrow opens `role=menu` and moves focus to last `role=menuitem`
    if (event.key === 'ArrowDown') {
      const menuElement = this.menuElementRef.current
      if (!menuElement) return
      const focusedMenuItemIdx = this.getNextFocusableMenuItemIdx()
      const focusedMenuItem = menuElement.childNodes[focusedMenuItemIdx]
      if (focusedMenuItem && focusedMenuItem.firstChild) {
        this.setState(state => ({focusedMenuItemIdx, isMenuOpen: true}))
        setTimeout(() => {
          focusedMenuItem.firstChild.focus()
        }, 0)
      }
    }

    // TODO
    // Home	Moves focus to the first menu item.
    // End	Moves focus to the last menu item.
    // A-Z
    // a-z
    //   Moves focus to the next menu item with a label that starts with the typed character if such an menu item exists.
    //   Otherwise, focus does not move.
  }

  focusDropDownButton() {
    const elm =
      this.actionsDropDownButtonRef &&
      this.actionsDropDownButtonRef.current &&
      this.actionsDropDownButtonRef.current._element
    if (elm) {
      setTimeout(() => {
        // console.log(elm)
        elm.focus()
      }, 0)
    }
  }

  getPreviousFocusableMenuItemIdx() {
    const {actions} = this.props
    const restActions = actions.slice(1)
    const actionsLength = restActions.length
    const focusableLength = restActions.filter(action => !action.disabled).length
    if (!focusableLength === 0) return -1
    let idx = this.state.focusedMenuItemIdx - 1
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (idx < 0) {
        idx = actionsLength
      } else if (restActions[idx] && !restActions[idx].disabled) {
        return idx
      }
      idx -= 1
    }
  }

  getNextFocusableMenuItemIdx() {
    const {actions} = this.props
    const restActions = actions.slice(1)
    const actionsLength = restActions.length
    const focusableLength = restActions.filter(action => !action.disabled).length
    if (!focusableLength === 0) return -1
    let idx = this.state.focusedMenuItemIdx + 1
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (idx >= actionsLength) {
        idx = -1
      } else if (restActions[idx] && !restActions[idx].disabled) {
        return idx
      }
      idx += 1
    }
  }

  render() {
    const {actions, idPrefix, isDisconnected} = this.props
    const {isMenuOpen} = this.state
    const firstAction = actions[0]
    const restActions = actions.slice(1)
    const restActionsLen = restActions.length
    const hasMoreActions = restActionsLen > 0

    return (
      <div className={isMenuOpen ? styles.isMenuOpen : styles.root}>
        {firstAction && (
          <div className={styles.mainAction}>
            <Button
              className={
                hasMoreActions ? styles.mainActionButtonWithMoreActions : styles.mainActionButton
              }
              color={firstAction.color}
              disabled={!firstAction.handleClick || isDisconnected || firstAction.disabled}
              onClick={firstAction.handleClick}
            >
              {firstAction.label}
            </Button>
          </div>
        )}

        {hasMoreActions && (
          <div className={styles.actionsDropDown} onKeyDown={this.handleDropDownKeyDown}>
            <Button
              aria-controls={`${idPrefix}-menu`}
              aria-haspopup="true"
              aria-label="Actions"
              className={styles.actionsDropDownButton}
              color={firstAction.color}
              disabled={isDisconnected}
              icon={ChevronDownIcon}
              id={`${idPrefix}-button`}
              onClick={this.handleDropDownButtonClick}
              ref={this.actionsDropDownButtonRef}
            />
            <div className={styles.menuContainer}>
              <ul
                aria-labelledby={`${idPrefix}-button`}
                className={styles.menu}
                data-menu
                id={`${idPrefix}-menu`}
                ref={this.menuElementRef}
                role="menu"
              >
                {restActions.map((action, idx) => (
                  <li className={styles.menuItem} key={action.id} role="presentation">
                    <button
                      className={styles.menuItemButton}
                      disabled={!action.handleClick || isDisconnected || action.disabled}
                      // eslint-disable-next-line react/jsx-no-bind
                      onClick={event => this.handleActionClick(event, action)}
                      role="menuitem"
                      tabIndex={-1}
                      type="button"
                    >
                      <div tabIndex={-1}>
                        {action.icon && (
                          <span className={styles.menuItemIcon}>
                            {React.createElement(action.icon)}
                          </span>
                        )}
                        <span className={styles.menuItemLabel}>{action.label}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default DocumentStatusBarActions

import { Component } from 'components/Component/component';

import ContextMenuTemplate from './contextMenu.hbs';
import './contextMenu.scss';

interface IContextMenuOption {
    class: string,
    dataId: string,
    value: string
}

interface IContextMenuProps {
    options: Array<IContextMenuOption>
}

export class ContextMenu extends Component<IContextMenuProps> {
    constructor(props?: IContextMenuProps) {
        super(props);
    }

    render(): string {
        return ContextMenuTemplate(this.props);
    }
}

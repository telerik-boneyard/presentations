import common = require("./side-bar-common");
import view = require("ui/core/view");
import dependencyObservable = require("ui/core/dependency-observable");
import proxy = require("ui/core/proxy");
import utils = require("utils/utils");

declare var com: any;

function onContentPropertyChanged(data: dependencyObservable.PropertyChangeData) {
    var bar = <SideBar>data.object;
    console.log(data.property.name + " property changed data.newValue:" + data.newValue);

    if (data.oldValue) {
        bar._removeView(data.oldValue);
    }
    if (data.newValue) {
        bar._addView(data.newValue);
    }
}

common.SideBar.mainContentProperty.metadata.onValueChanged = onContentPropertyChanged;
common.SideBar.slideContentProperty.metadata.onValueChanged = onContentPropertyChanged;

export class SideBar extends common.SideBar {
    public _createUI() {
        this._android = new com.telerik.android.primitives.widget.sidedrawer.RadSideDrawer(this._context);
        this._android.setDrawerSize(utils.layout.getDisplayDensity() * 280);
    }

    private _android: any;
    get android(): any {
        return this._android;
    }

    public _onBindingContextChanged(oldValue: any, newValue: any) {
        super._onBindingContextChanged(oldValue, newValue);

        if (this.mainContent instanceof view.View) {
            this.mainContent.bindingContext = this.bindingContext;
        }

        if (this.slideContent instanceof view.View) {
            this.slideContent.bindingContext = this.bindingContext;
        }
    }

    public _addViewToNativeVisualTree(child: view.View): boolean {
        if (this._android && child.android) {
            if (this.mainContent === child) {
                this._android.setMainContent(child.android);
                return true;
            }

            if (this.slideContent === child) {
                this._android.setDrawerContent(child.android);
                return true;
            }
        }

        return false;
    }

    public _removeViewFromNativeVisualTree(child: view.View): void {
        if (this._android && child.android) {
            if (this.mainContent === child) {
                this._android.setMainContent(null);
                (<any>child)._isAddedToNativeVisualTree = false;
            }

            if (this.slideContent === child) {
                this._android.setDrawerContent(null);
                (<any>child)._isAddedToNativeVisualTree = false;
            }
        }
    }

    public openSlideContent(): void {
        if (this.android) {
            this.android.setIsOpen(true);
        }
    }

    public closeSlideContent(): void {
        if (this.android) {
            this.android.setIsOpen(false);
        }
    }
}
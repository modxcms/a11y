/*
This file is part of Ext JS 3.4

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-04-03 15:07:25

Edited by: novriko@modx.com
*/
(function() {
Ext.ns('Ext.a11y');

Ext.a11y.ARIA = Ext.apply(new Ext.util.Observable(), function() {
    return {
        setRole : function(el, role) {
            el = Ext.getDom(el);
            if(el) {
                el.setAttribute('role', role.toString());
            }
        },

        setProperty : function(el, key, value) {
            el = Ext.getDom(el);
            if(el) {
                el.setAttribute(key.toString(), value.toString());
            }
        }
    }
}());

var ARIA = Ext.a11y.ARIA;

Ext.override(Ext.tree.TreeNode, {
    render : function(bulkRender){
        this.ui.render(bulkRender);
        if(!this.rendered){
            // make sure it is registered
            this.getOwnerTree().registerNode(this);
            this.rendered = true;
            this.fireEvent('noderender', this);
            if(this.expanded){
                this.expanded = false;
                this.expand(false, false);
            }
        }
    }
});

Ext.override(Ext.tree.TreePanel, {
    initARIA : function() {
        //Ext.tree.TreePanel.superclass.initARIA.call(this);
        this.getSelectionModel().on('selectionchange', this.onNodeSelect, this);
        this.ariaTreeEl = this.body.down('.x-tree-root-ct');
        this.on('collapsenode', this.onNodeCollapse, this);
        this.on('expandnode', this.onNodeExpand, this);
    },

    originalMethods: {
        onRender: Ext.tree.TreePanel.prototype.onRender
    },
    
    onRender: function(ct, position){
        this.originalMethods.onRender.call(this, ct, position);
        this.initARIA();                     
    },

    // private
    registerNode : function(node){
        if(this.nodeHash[node.id] === undefined) {
            node.on('noderender', this.onNodeRender, this);
        }
        this.nodeHash[node.id] = node;
    },

    // private
    unregisterNode : function(node){
        node.un('noderender', this.onNodeRender, this);
        delete this.nodeHash[node.id];
    },

    onNodeRender : function(node) {
        var a = node.ui.anchor,
            level = this.rootVisible ? 1 : 0,
            pnode = node;

        if(node.isRoot) {
            ARIA.setRole(this.ariaTreeEl, 'tree');
            ARIA.setProperty(this.ariaTreeEl, 'aria-labelledby', this.ariaTreeEl.up('li.x-panel').dom.getElementsByClassName('x-panel-header-text')[0].id);
            ARIA.setProperty(this.ariaTreeEl, 'aria-activedescendant', 'false');
            if(!this.rootVisible) {
                return;
            }
        }
        ARIA.setRole(node.ui.wrap, 'treeitem');
        ARIA.setProperty(node.ui.wrap, 'aria-labelledby', Ext.id(node.ui.textNode));
        ARIA.setProperty(node.ui.wrap, 'aria-expanded', 'false');
        ARIA.setProperty(node.ui.wrap, 'aria-selected', 'false');
        while (pnode.parentNode) {
            level++;
            pnode = pnode.parentNode;
        }
        ARIA.setProperty(node.ui.wrap, 'aria-level', level);
        if(!node.isLeaf()) {
            ARIA.setRole(node.ui.ctNode, 'group');
            ARIA.setProperty(node.ui.wrap, 'aria-expanded', node.isExpanded());
        }

        //node.gear = Ext.Element.fly(node.ui.textNode.parentNode).insertSibling({
        //    tag:'div',
        //    html:'',
        //    cls: 'icon icon-gear a11y-gear',
        //    tabindex: 1
        //}, 'after');
        //
        //node.gear.hide();
        //
        //node.gear.on('keydown', function(e){
        //    if (e.getKey() == Ext.EventObject.ENTER) {
        //        this._showContextMenu(node, e);                 
        //    } else {
        //        if ((e.getKey() != Ext.EventObject.SHIFT) && (e.getKey() != Ext.EventObject.TAB)) {
        //            node.gear.hide();
        //        }
        //    }
        //}, this);

        Ext.get(node.ui.textNode.parentElement).on('keydown', function(e){
            if ((e.getKey() == Ext.EventObject.F10) && (e.ctrlKey == true)) {
                this._showContextMenu(node, e);
                
                //move the context menu to just below the item focused
                var bodyRect = document.body.getBoundingClientRect();
				var elemRect = node.ui.textNode.parentElement.getBoundingClientRect();
    			var offset   = elemRect.top - bodyRect.top;
				var floatingLayer = document.getElementsByClassName("x-menu-floating");
				for(var i=0;i<floatingLayer.length;i++){
					floatingLayer[i].style.top = (offset+22)+"px";
					floatingLayer[i].style.left = "2px";
				}	
				
            }
        }, this);
        
        node.ui.textNode.parentNode.setAttribute('tabindex', -1);
        Ext.get(node.ui.textNode.parentElement).on('focus', function(e){
            node.select();
            
            //if (node.gear) {
            //    node.gear.show();
            //}
        }, this);

        Ext.get(node.ui.textNode.parentElement).on('blur', function(e){
            //if (node.gear) {
            //    var target = e.getRelatedTarget();
            //    if (target) {
            //        if (!target.classList.contains('a11y-gear')) {
            //            node.gear.hide();
            //        }
            //    } else {
            //        node.gear.hide();
            //    }
            //}
        }, this);
        
        //Ext.get(node.ui.textNode.parentElement).on('keydown', function(e){
        //    if ([Ext.EventObject.UP, Ext.EventObject.DOWN].indexOf(e.getKey()) != -1) {
        //        node.gear.hide();
        //    }
        //}, this);
        
        //Ext.get(node.gear).on('blur', function(e){
        //    node.gear.hide();
        //}, this);
        
    },

    onNodeSelect : function(sm, node) {
        if (node) {
            ARIA.setProperty(this.ariaTreeEl, 'aria-activedescendant', Ext.id(node.ui.wrap));
            ARIA.setProperty(node.ui.wrap, 'aria-selected', 'true');
        }
    },

    onNodeCollapse : function(node) {
        ARIA.setProperty(node.ui.wrap, 'aria-expanded', 'false');
    },

    onNodeExpand : function(node) {
        ARIA.setProperty(node.ui.wrap, 'aria-expanded', 'true');
    }
});

})();
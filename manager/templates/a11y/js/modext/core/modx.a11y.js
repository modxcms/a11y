Ext.namespace('MODx.a11y');

MODx.a11y = Ext.apply(Ext.a11y, {
    init: function() {
        //who to watch
        Ext.get('modx-navbar').on({
            'keydown':this.whosFocused
            ,'mouseleave':this.clearSubNavOpen
        });
        //give help an ID by editing line 175 in /controllers/
        Ext.get('help-link').on({
            'keydown':this.clearSubNavOpen
        });
        //search actions
        Ext.get('modx-uberbar').on({
            'focus':function(){
                Ext.get('mgr-search-wrapper').addClass('search-movement');
            }
            ,'blur': function(){
                Ext.get('mgr-search-wrapper').removeClass('search-movement');
            }
        });
        this.initFont();
    }
    ,whosFocused: function() {
		var curElement = document.activeElement;
		//localStorage.setItem('curFocus',curElement);
console.log("currently selected:"+curElement);
		//console.log(curElement.nextSibling.nextSibling.className);
		var nextDude = curElement.nextSibling.nextSibling;
		if(nextDude.className == "modx-subnav"){
			//console.log("bazinga");
			//clear any open subnavs
			clearSubNavOpen();

			//force open subnav
			nextDude.className = "modx-subnav open";
		}
    }
    ,clearSubNavOpen: function() {
        var topNav = Ext.get('modx-topnav');
        var findSubOpen = topNav.query('.modx-subnav.open');
        if (findSubOpen.length === 0) {
            return;
        }
        Ext.each(findSubOpen, function(item,idx){
            item.removeClass('open');
        });
    }
    ,initFont:function(){
        var cookie = new MODx.cookie();
        var bfsCheck = cookie.get('bodyfontsize');
        if (!bfsCheck) {
            cookie.create("bodyfontsize", 0, 30);
            setTimeout(function () {
                Ext.get('modx-body-tag').setStyle('font-size', "1.0em");
            }, 1000);
        } else {
            setTimeout(function () {
                Ext.get('modx-body-tag').setStyle('font-size', "1."+bfsCheck+"em");
            }, 1000);
        }
        var dstCheck = cookie.get('dysfont');
        if(dstCheck){
            Ext.DomHelper.append(Ext.getHead(), {
                tag: 'link'
                ,type:'text/css'
                ,rel:'stylesheet'
                ,href:MODx.config.manager_url+'templates/a11y/css/dyslexia.css'
            });
        }
    }
    ,bfsIncrease: function(){
        var cookie = new MODx.cookie();
        var bfsCheck = cookie.get('bodyfontsize');
        var newBfs = Number(bfsCheck)+1;
        cookie.create("bodyfontsize", newBfs, 30);
        Ext.get('modx-body-tag').setStyle('font-size', "1."+newBfs+"em");
    }
    ,bfsDecrease:function(){
        var cookie = new MODx.cookie();
        var bfsCheck = cookie.get('bodyfontsize');
        var newBfs = Number(bfsCheck)-1;
        if (newBfs<0)return;
        cookie.create("bodyfontsize", newBfs, 30);
        Ext.get('modx-body-tag').setStyle('font-size', "1."+newBfs+"em");
    }
    ,dyslexiaToggler:function(){
        var cookie = new MODx.cookie();
        var dstCheck = cookie.get('dysfont');
        if(dstCheck){
            cookie.remove("dysfont");
            location.reload();
        } else {
            cookie.create("dysfont", "true", 30);
            location.reload();
        }
    }
    ,initTree:function(){
        //Vertical Tab role assignment
        var modxLayout = Ext.getCmp('modx-layout');
console.log('modxLayout',modxLayout);
        var tabPanel = Ext.getCmp('modx-leftbar-tabs');
        if (typeof(tabPanel)!=='undefined') {
console.log('this',this);
            this.ARIA.setRole('modx-leftbar-tabs', 'tablist');
            this.ARIA.setProperty('modx-leftbar', 'aria-label', 'Resources Elements and Files Tablist');
//            Ext.getCmp('modx-leftbar-tabs').initFocus();
        }
        var resTree = Ext.getCmp('modx-resource-tree');
console.log('resTree',resTree);
        if (typeof(resTree)!=='undefined') {
            this.ARIA.setProperty('modx-resource-tree', 'role', 'tab');
//            Ext.getCmp('modx-resource-tree').getEl().addClass('x-a11y-focusable');
            resTree.on('expand',function(panel){
console.log('panel',panel);
            });
        }
        var elTree = Ext.getCmp('modx-tree-element');
        if (typeof(elTree)!=='undefined') {
            this.ARIA.setProperty('modx-tree-element', 'role', 'tab');
//            Ext.getCmp('modx-tree-element').getEl().addClass('x-a11y-focusable');
        }
        var fileTree = Ext.getCmp('modx-file-tree');
        if (typeof(fileTree)!=='undefined') {
            this.ARIA.setProperty('modx-file-tree', 'role', 'tab');
//            Ext.getCmp('modx-file-tree').getEl().addClass('x-a11y-focusable');
            fileTree.initFocus();
        }
    }
});

MODx.cookie = function(){
    return {
        create: function(name, value, days) {
            var expires;

            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
        }
        ,get: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
        ,remove: function(name){
            this.create(name,"",-1);
        }
    };
};
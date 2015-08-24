Ext.namespace('MODx.a11y');

MODx.a11y.ARIA = function(config) {
    config = config || {};

    Ext.applyIf(config,{

    });

    MODx.a11y.ARIA.superclass.constructor.call(this,config);
};

Ext.extend(MODx.a11y.ARIA,Ext.a11y.ARIA, {
    initA11y: function() {
console.log('initA11y');

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
        //Vertical Tab role assignment
        if (typeof(Ext.getCmp('modx-leftbar'))!=='undefined') {
            this.setRole('modx-leftbar', 'tablist');
            this.setProperty('modx-leftbar', 'aria-label', 'Resources Elements and Files Tablist');
        }
        if (typeof(Ext.getCmp('modx-resource-tree'))!=='undefined') {
            this.setProperty('modx-resource-tree', 'role', 'tab');
        }
        if (typeof(Ext.getCmp('modx-tree-element'))!=='undefined') {
            this.setProperty('modx-tree-element', 'role', 'tab');
        }
        if (typeof(Ext.getCmp('modx-file-tree'))!=='undefined') {
            this.setProperty('modx-file-tree', 'role', 'tab');
        }
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
    ,createCookie: function(name, value, days) {
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
    ,readCookie:function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    ,eraseCookie:function(name) {
        createCookie(name,"",-1);
    }
});
Ext.reg('modx-a11y-aria',MODx.a11y.ARIA);
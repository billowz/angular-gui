angular.module('ngui.dropdown', [])

.constant('nguiDropdownConfig', {
  openClass: 'open'
})
.controller('nguiDropdownController', ['$scope', '$attrs', '$parse', 'nguiDropdownConfig', '$document', '$animate', function($scope, $attrs, $parse, dropdownConfig, $document, $animate) {
  var self = this,
      scope = $scope.$new(), // create a child scope so we are not polluting original one
      openClass = dropdownConfig.openClass,
      getIsOpen,
      setIsOpen = angular.noop,
      toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;

  this.init = function( element ) {
    self.$element = element;

    if ( $attrs.isOpen ) {
      getIsOpen = $parse($attrs.isOpen);
      setIsOpen = getIsOpen.assign;

      $scope.$watch(getIsOpen, function(value) {
        scope.isOpen = !!value;
      });
    }
  };
  this.isSubmenu = function(){
    return self.$element.hasClass('dropdown-submenu');
  }
  this.toggle = function( open ) {
    return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
  };

  // Allow other directives to watch status
  this.isOpen = function() {
    return scope.isOpen;
  };

  scope.getToggleElement = function() {
    return self.toggleElement;
  };

  scope.focusToggleElement = function() {
    if ( self.toggleElement ) {
      self.toggleElement[0].focus();
    }
  };
  var closeDropdown = function( evt ) {

    var toggleElement = scope.getToggleElement();

    if ( evt && toggleElement && toggleElement[0].contains(evt.target) ) {
        return;
    }

    scope.$apply(function() {
      scope.isOpen = false;
    });
  };

  var escapeKeyBind = function( evt ) {
    if ( evt.which === 27 ) {
      scope.focusToggleElement();
      closeDropdown();
    }
  };
  scope.$watch('isOpen', function( isOpen, wasOpen ) {
    $animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);

    if ( isOpen ) {
      scope.focusToggleElement();
      $document.bind('click', closeDropdown);
      $document.bind('keydown', escapeKeyBind);
      //dropdownService.open( scope );
    } else {
      $document.unbind('click', closeDropdown);
      $document.unbind('keydown', escapeKeyBind);
      //dropdownService.close( scope );
    }

    setIsOpen($scope, isOpen);
    if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
      toggleInvoker($scope, { open: !!isOpen });
    }
  });

  $scope.$on('$locationChangeSuccess', function() {
    scope.isOpen = false;
  });

  $scope.$on('$destroy', function() {
    scope.$destroy();
  });
}])

.directive('nguiDropdown', function() {
  return {
    controller: 'nguiDropdownController',
    link: function(scope, element, attrs, dropdownCtrl) {
      dropdownCtrl.init( element );
    }
  };
})

.directive('nguiDropdownToggle', function() {
  return {
    require: '?^nguiDropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if ( !dropdownCtrl ) {
        return;
      }

      dropdownCtrl.toggleElement = element;

      var toggleDropdown = function(event) {
        event.preventDefault();
        if(dropdownCtrl.isSubmenu()){
          event.stopPropagation();
          angular.forEach(element.parent().siblings('[ngui-dropdown]'), function(el){
            var ctr = angular.element(el).controller('nguiDropdown');
            if(ctr && ctr.isOpen()){
              ctr.toggle(false);
            }
          });
        }
        if ( !element.hasClass('disabled') && !attrs.disabled ) {
          scope.$apply(function() {
            dropdownCtrl.toggle();
          });
        }
      };

      element.bind('click', toggleDropdown);

      // WAI-ARIA
      element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
      scope.$watch(dropdownCtrl.isOpen, function( isOpen ) {
        element.attr('aria-expanded', !!isOpen);
      });

      scope.$on('$destroy', function() {
        element.unbind('click', toggleDropdown);
      });
    }
  };
});

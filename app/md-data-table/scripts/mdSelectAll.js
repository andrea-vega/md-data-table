angular.module('md.data.table').directive('mdSelectAll', mdSelectAll);

function mdSelectAll($timeout) {
  'use strict';
  
  function template(tElement) {
    var checkbox = angular.element('<md-checkbox></md-checkbox>');
    
    checkbox.attr('aria-label', 'Select All');
    checkbox.attr('ng-click', 'toggleAll()');
    checkbox.attr('ng-class', 'mdClasses');
    checkbox.attr('ng-checked', 'allSelected()');
    checkbox.attr('ng-disabled', '!getCount()');
    
    tElement.append(checkbox);
  }
  
  function postLink(scope, element, attrs, tableCtrl) {
    var count = 0;
    
    var getSelectableItems = function() {
      // WORKAROUND md-virtual-repeat has items nested on the object
      var items = scope.items.items || scope.items;
      return items.filter(function () {
        // TODO add support for disabled rows
        //return !tableCtrl.isDisabled(item);
        return true;
      });
    };

    $timeout(function () {
      scope.mdClasses = tableCtrl.classes;
      
      scope.getCount = function() {
        // TODO add support for disabled rows
        var items = scope.items.items || scope.items;
        count = items.length;
        return count;
        //return (count = items.reduce(function(sum, item) {
        //  return tableCtrl.isDisabled(item) ? sum : ++sum;
        //}, 0));
      };
      
      scope.allSelected = function () {
        return count && count === tableCtrl.selectedItems.length;
      };
      
      scope.toggleAll = function () {
        var items = scope.items.items || scope.items;
        var selectableItems = getSelectableItems(items);

        if(items.length === tableCtrl.selectedItems.length) {
          tableCtrl.selectedItems.splice(0);
        } else {
          tableCtrl.selectedItems = selectableItems;
        }
      };
    });
  }
  
  return {
    link: postLink,
    require: '^^mdDataTable',
    scope: {
      items: '=mdSelectAll'
    },
    template: template
  };
}

mdSelectAll.$inject = ['$timeout'];
/**
 * : function(string, Function):angular.Module,
  factory: function(string, Function):angular.Module,
  value: function(string, *):angular.Module,

  filter: function(string, Function):angular.Module,

  init: function(Function):angular.Module
} }
 */
type service = {
    requires: string[];
    invokeQueue: any[][];
};

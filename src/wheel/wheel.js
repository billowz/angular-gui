angular.module('ngui.wheel', [])
  .directive('nguiWheel', [function() {
    return {
      restrict: 'A',
      template: '<div class="ui-wheel"></div>',
      replace: true,
      link: function($scope, $element, $attr) {
        var wheel = $element.wheel();
      }
    }
  }]);

(function() {



  var __wheelIdxGen = 0;


  var wheel = function(wheelEl, option) {
    wheelEl = $(wheelEl);
    var wheelId = wheelEl.attr('id');
    if (!wheelId) {
      wheelId = 'ui-wheel-' + (++__wheelIdxGen);
      wheelEl.attr('id', wheelId);
    }
    var wheelSvgId = wheelId + '-svg';
    var wheelBlurId = wheelId + '-blur';
    var wheelCoordinateId = wheelId + '-coordinate';
    var wheelPanelId = wheelId + '-panel';
    var wheelNotiId = wheelId + '-notification';
    var wheelNavAllId = wheelId + '-nav-all';
    var wheelNavSelId = wheelId + '-nav-selected';
    var wheelNavCursorId = wheelId + '-nav-cursor';
    var wheelSelId = wheelId + '-selection';
    var wheelRingsId = wheelId + '-rings';

    var r0 = 100; // radius of ring 0
    var ri = 66; // radius interval, i.e. distance between rings
    var rr = 0.8;

    var dt = 600; // delta time, i.e. duration of animation per item
    var t1 = 0.99;
    var da1 = 150; // max delta angle
    var da2 = 135; // delta angle when animation ends

    var a1 = -45; // the end angle of the first item of ring 0
    var ai0 = 44;

    return {
      id: wheelId,
      visible: false,
      selection: {
        level: 0,
        children: [{
          level: 1,
          text: 'test'
        }, {
          level: 1,
          text: 'test2'
        }, {
          level: 1,
          text: 'test2'
        }]
      },
      load: function(config) {
        this.selection = config || [];
      },
      resize: function() {
        if (this.visible) {
          this.left = this.leftPerc * $('#' + wheelId).width();
          this.top = this.topPerc * $('#' + wheelId).height();
          d3.select('#ui-wheel-coordinate').attr('transform', 'translate(' + this.left + ',' + this.top + ')');
        }
      },
      init: function(left, top) {

        this.left = left - $('#' + wheelId).offset().left;
        this.top = top - $('#' + wheelId).offset().top;

        this.leftPerc = this.left / $('#' + wheelId).width();
        this.topPerc = this.top / $('#' + wheelId).height();

        //配置标签
        //<svg id='ui-wheel-svg'><defs><filter id='ui-wheel-blur'><feGaussianBlur></feGaussianBlur></filter></defs></svg>
        this.config = {
          tag: 'svg', // create the wheel svg
          attributes: {
            id: wheelSvgId
          },
          els: [{
            tag: 'defs',
            els: [{
              tag: 'filter',
              attributes: {
                id: wheelBlurId
              },
              els: [{
                tag: 'feGaussianBlur',
                attributes: {
                  stdDeviation: 1
                }
              }]
            }]
          }, {
            tag: 'g', // create the polar coordinate
            attributes: {
              id: wheelCoordinateId,
              transform: 'translate(' + this.left + ',' + this.top + ')' // set the orgin of the coordinate to where the mouse was clicked
            },
            els: [{
              tag: 'g', // create the center of the wheel
              els: [{
                tag: 'image',
                attributes: {
                  id: wheelPanelId,
                  x: -66, // align the image to its center
                  y: -66,
                  width: 132, // set image to its size
                  height: 132,
                  'xlink:href': 'wheel-background.png'
                },
                styles: {
                  opacity: 0 // make it transparent initially so that the COW can fade in when shown
                }
              }, {
                tag: 'g',
                attributes: {
                  id: wheelNotiId
                }
              }, {
                tag: 'circle',
                attributes: {
                  id: wheelNavAllId,
                  r: 0
                },
                styles: {
                  fill: 'none',
                  stroke: '#fff',
                  'stroke-width': 5
                }
              }, {
                tag: 'g',
                attributes: {
                  id: wheelNavSelId
                }
              }, {
                tag: 'g',
                attributes: {
                  id: wheelNavCursorId
                }
              }, {
                tag: 'circle',
                attributes: {
                  id: wheelSelId,
                  r: 30
                },
                styles: {
                  fill: 'none',
                  'pointer-events': 'all'
                }
              }]
            }, {
              tag: 'g', // create the rings
              attributes: {
                id: wheelRingsId
              }
            }]
          }]
        };

        this.wheel = d3.select('#' + wheelId);

        var _this = this;

        this.arcSelected = d3.svg.arc()
          .innerRadius(40)
          .outerRadius(44)
          .startAngle(function(d) {
            return _this.scale(d.start);
          })
          .endAngle(function(d) {
            return _this.scale(d.start + d.increment);
          });
        this.arcCursor = d3.svg.arc()
          .innerRadius(40.5)
          .outerRadius(43.5)
          .startAngle(function(d) {
            return _this.scale(d.start);
          })
          .endAngle(function(d) {
            return _this.scale(d.start + d.increment);
          });
      },

      create: function(parent, config) {
        var el = parent.append(config.tag);
        if (config.attributes) {
          for (var attr in config.attributes) {
            el.attr(attr, config.attributes[attr]);
          }
        }
        if (config.styles) {
          for (var style in config.styles) {
            el.style(style, config.styles[style]);
          }
        }
        if (config.els) {
          var _this = this;
          $.each(config.els, function(idx, child) {
            _this.create(el, child);
          });
        }
      },

      hide: function() {
        d3.select('#' + wheelSelId).on('click', null); // disable click event

        this.updateRing({
          level: 0,
          children: []
        });

        d3.select('#' + wheelPanelId).transition().duration(50).style('opacity', 0);

        d3.select('#' + wheelNavCursorId).transition().delay(20).remove();
        d3.select('#' + wheelNavSelId).transition().remove();
        d3.select('#' + wheelNavAllId).transition().delay(20).duration(100).attr('r', 50).transition()
          .delay(200).duration(50).ease('in-out' /* TODO */ ).attr('r', 30).style('stroke', '#666').transition()
          .delay(700).duration(50).ease('in-out' /* TODO */ ).attr('r', 15)

        d3.select('#' + wheelSvgId).transition().delay(700).remove();
      },

      show: function(left, top) {
        if (!this.visible) {
          this.visible = true;
          d3.select('#' + wheelSvgId).remove();

          this.init(left, top);
          this.create(this.wheel, this.config);

          var _this = this;

          d3.select('#' + wheelSvgId)
            .style("width", "100%")
            .style("height", "100%")
            .on('DOMNodeRemoved', function() {
              _this.visible = false;
            })
            .on('mousemove', function() {
              //            fisheye.center(d3.mouse(this));
            });

          d3.select('#' + wheelSelId).on('mousedown', function() {
            switch (d3.event.button) {
              case 2:
                _this.hide();
                _this.showExplode({
                  x: d3.event.x,
                  y: d3.event.y
                });
                break;
            }
          });
          /*
          var hammer = new Hammer(document.getElementById(wheelSelId), {
            tap_max_interval: 700 // seems to bee needed for IE8
          });

          hammer.ontap = function(e) {
            if (_this.selection.parent) {
              _this.selection = _this.selection.parent;
              _this.updateRing(_this.selection);
            } else {
              _this.hide();
            }
          };

          hammer.ontransformstart = function(e) {
            _this.hide();
            _this.showExplode({
              x: e.originalEvent.pageX,
              y: e.originalEvent.pageY
            });
          };*/
          //2012-10-30 yangjunping 注释 ondrag事件与split有冲突
          /*hammer.ondrag = function(e) {
            _this.left = e.originalEvent.pageX;
            _this.top = e.originalEvent.pageY;
            d3.select('#ui-wheel-coordinate').attr('transform', 'translate(' + _this.left + ',' + _this.top + ')');
          };*/

          d3.select('#' + wheelPanelId).transition().duration(50).ease('out-in' /* TODO */ ).style('opacity', 1);

          d3.select('#' + wheelNavAllId).transition().duration(55).ease('out-in' /* TODO */ ).attr('r', 42);

          this.updateNav();

          this.updateRing(this.selection);
        }
      },

      updateNav: function() {
        if (this.list) {
          this.updateNavSelection();
          this.updateNavCursor(this.list.getCursor());
        }
      },

      updateNavSelection: function() {
        var _this = this;
        var total = this.list.getTotal();
        var selected = this.list.getSelectedIndex();
        var duration = 600 / total;
        var nav = d3.select('#' + wheelNavSelId).selectAll('path')
          .data(selected, function(d) {
            return wheelNavSelId + '-' + d.total + '-' + d.start + '-' + d.end;
          });
        nav.exit()
          .transition().duration(function(d) {
            return (d.end - d.start + 1) * duration;
          })
          .attrTween('d', function(d, i, a) {
            return function(t) {
              return _this.arcSelected({
                start: d.start,
                increment: (d.end + 1 - d.start) * (1 - t)
              });
            }
          })
          .remove();
        nav.enter().append('path')
          .style('fill', '#999999')
          .transition().duration(function(d) {
            return (d.end - d.start + 1) * duration;
          })
          .attrTween('d', function(d, i, a) {
            return function(t) {
              return _this.arcSelected({
                start: d.start,
                increment: (d.end + 1 - d.start) * t
              });
            }
          })
      },

      updateNavCursor: function(index) {
        var _this = this;
        var total = this.list.getTotal();
        var duration = 600 / total;
        var nav = d3.select('#' + wheelNavCursorId).selectAll('path')
          .data([{
            start: index,
            total: total
          }], function(d) {
            return wheelNavCursorId + '-' + d.total + '-' + d.start;
          });
        nav.exit()
          .transition().duration(duration)
          .attrTween('d', function(d, i, a) {
            return function(t) {
              return _this.arcCursor({
                start: d.start,
                increment: 1 - t
              });
            }
          }).remove();
        nav.enter().append('path')
          .style('fill', '#fdd97e')
          .transition().duration(duration)
          .attrTween('d', function(d, i, a) {
            return function(t) {
              return _this.arcCursor({
                start: d.start,
                increment: t
              });
            }
          });

        /*
              // alternative approach that represent the cursor as a dot in the middle of the arc
              var total = this.list.getTotal();
              var _this = this;
              var nav = d3.select('#'+wheelNavCursorId).selectAll('circle')
                .data([{ index: index, total: total }], function(d) { return 'ui-wheel-nav-cursor-' + d.total + '-' + d.index });
              nav.enter().append('circle')
                .style('fill', '#fdd97e')
                .attr('r', 2.5)
                .transition()
                .duration(20)
                .attr('transform', function(d) {
                  var angle = (_this.scale(d.index) + _this.scale(d.index + 1)) / 2;
                  var angle = _this.scale(d.index);
                  var r = 42;
                  var x = r * Math.sin(angle);
                  var y = -r * Math.cos(angle);
                  return 'translate(' + x + ',' + y + ')';
                });
              nav.exit().remove();
         */
      },

      setNavList: function(list) {
        this.list = list;
        this.scale = d3.scale.linear().domain([0, this.list.getTotal()]).range([0, Math.PI * 2]);

        this.updateNav();

        var _this = this;
        list.addListener('selectionChanged', function() {
          _this.updateNavSelection();
        });
        list.addListener('cursorChanged', function(index) {
          _this.updateNavCursor(index);
        });
      },

      interpolateAngle: function(t) {
        return t <= t1 ? da1 / t1 * t : (da2 - da1) / (1 - t1) * t + da2 * (1 + (da1 / da2 - 1) / (1 - t1));
      },

      interpolateRadius: function(t, r) {
        return t <= t1 ? r * (1 - rr) / t1 * t + r * rr : r;
      },

      removeItems: function(items) {
        var _this = this;
        items.exit()
          .transition().duration(dt)
          .style('opacity', '0')
          .attrTween('transform', function(d, i, a) {
            var dl = d.level - _this.selection.level - 1; // delta leval
            var r = r0 + ri * dl; // radius of current ring (in which the item sits)
            return function(t) {
              var a = (d.a1 + da2 - _this.interpolateAngle(1 - t)) / 180 * Math.PI;
              var r1 = _this.interpolateRadius(1 - t, r)
              var x = Math.sin(a) * r1;
              var y = -Math.cos(a) * r1;
              return 'translate(' + x + ',' + y + ')';
            }
          })
          .remove();
      },

      updateItems: function(items) {
        var _this = this;
        items.enter().append('g')
          .style('opacity', '0')
          .transition().duration(dt)
          .style('opacity', '1')
          .attrTween('transform', function(d, i, a) {
            var dl = d.level - _this.selection.level - 1; // delta leval
            var r = r0 + ri * dl; // radius of current ring (in which the item sits)
            d.ai = r0 / r * ai0; // angle interval, i.e. angle between adjacent items in the same ring
            d.a1 = d.parent.a1 - d.ai * (d.parent.children.length - 1) / 2 + d.ai * i;
            var a0 = d.a1 - da2;
            return function(t) {
              var a = (a0 + _this.interpolateAngle(t)) / 180 * Math.PI;
              var r1 = _this.interpolateRadius(t, r)
              var x = Math.sin(a) * r1;
              var y = -Math.cos(a) * r1;
              return 'translate(' + x + ',' + y + ')';
            }
          })
          .each(function(d) {
            var item = d3.select(this);
            var circle = item.append('circle')
              .style('pointer-events', 'all')
              .style('fill', '#282828')
              .style('stroke', '#fff')
              .style('stroke-width', 6)
              .style('opacity', 0.45)
              //            .attr("filter", "url(#ui-wheel-blur)")
              .attr('r', 20.5)
              .on('mouseover', function(d) {
                var x = 60 * Math.sin(d.a1 / 180 * Math.PI);
                var y = -60 * Math.cos(d.a1 / 180 * Math.PI);
                d3.select(this)
                  .style('opacity', 1)
                  .transition().duration(100)
                  .style('stroke-width', 10)
                d3.select(this.parentNode)
                  .append('g')
                  .attr('transform', 'translate(' + x + ',' + y + ')')
                  .style('fill', '#2591ff')
                  .append('text')
                  .style('font-family', 'Calibri')
                  .style('font-size', '12px')
                  .style('font-weight', 'bold')
                  .style('color', '#fff')
                  .text(d.text);
              })
              .on('mouseout', function(d) {
                d3.select(this)
                  .style('opacity', 0.45)
                  .transition().duration(50)
                  .style('stroke-width', 6)
                d3.select(this.parentNode)
                  .select('g').remove();
              })
              .on('mousedown', function(d) {
                switch (d3.event.button) {
                  case 2:
                    _this.hide();
                    _this.selection = d;
                    _this.showExplode({
                      x: d3.event.x,
                      y: d3.event.y
                    });
                    break;
                }
              });

            var hammer = new Hammer(circle[0][0], {
              tap_max_interval: 700 // seems to bee needed for IE8
            });
            hammer.ontap = function(e) {
              var d = circle[0][0].__data__;
              if (d.children && d.children.length > 0) {
                circle.transition().duration(50)
                  .style('opacity', 1)
                  .style('stroke', '#fdd97e')
                _this.updateRing(d);
              } else if (d.nameTag) {
                _this.showPanel(d.nameTag);
              }
            };
            hammer.ondoubletap = function(e) {
              //            var d = circle[0][0].__data__;
              //            circle.transition().duration(50)
              //            .style('opacity', 1)
              //            .style('stroke', '#fdd97e')
              //            _this.updateRing(d);
            };
            hammer.ontransformstart = function(e) {
              _this.hide();
              _this.selection = circle[0][0].__data__;
              _this.showExplode({
                x: e.originalEvent.pageX,
                y: e.originalEvent.pageY
              });
            };

            item.append('image')
              .attr('x', -18)
              .attr('y', -18)
              .attr('width', 36)
              .attr('height', 36)
              .attr('xlink:href', d.icon);
          });
      },

      updateRing: function(item) {
        var dl = item.level - this.selection.level; // delta leval

        this.selection.a1 = a1;
        this.selection.ai = ai0;

        var ring = d3.select('#' + wheelRingsId).selectAll('.ui-wheel-ring')
          .data(d3.range(dl + 1), function(d) {
            return d;
          });

        this.removeItems(ring);

        var items = ring.enter().append('g')
          .attr('class', 'ui-wheel-ring')
          .selectAll('g')
          .data(function(d) {
            return item.children[dl - d];
          }, function(d) {
            return d.id;
          });
        this.updateItems(items);

        items = ring.selectAll('g')
          .data(function(d) {
            return item.children[dl - d];
          }, function(d) {
            return d.id;
          });

        this.removeItems(items);

        this.updateItems(items);
      },

      showExplode: function(p) {
        var el = Ext.get('ui-wheel');

        var radius = Math.min(el.getWidth(), el.getHeight()) / 2 * 1.1;

        var tree = d3.layout.tree()
          .size([360, radius - 120])
          .separation(function(a, b) {
            return (a.parent == b.parent ? 1 : 2) / a.depth;
          });

        var diagonal = d3.svg.diagonal.radial()
          .projection(function(d) {
            return [d.y, d.x / 180 * Math.PI];
          });

        var drag = d3.behavior.drag()
          .on('drag', function() {
            _this.left += d3.event.dx;
            _this.top += d3.event.dy;
            d3.select(this).attr('transform', 'translate(' + _this.left + ',' + _this.top + ')');
          });

        this.left = p.x;
        this.top = p.y;

        d3.select('#' + wheelSvgId).remove();
        d3.select("#ui-wheel")
          .append('div')
          .style('top', '10px')
          .style('left', '10px')
          .style('bottom', '10px')
          .style('right', '10px')
          .style('background-color', '#000')
          .style('opacity', 0.4)
          .style('position', 'absolute');

        var vis = d3.select("#ui-wheel")
          .append('div')
          .style('top', '10px')
          .style('left', '10px')
          .style('bottom', '10px')
          .style('right', '10px')
          .style('position', 'absolute')
          .append("svg")
          .append("g")
          .style('background-color', 'white')
          .attr("transform", "translate(" + (this.left - 10) + "," + (this.top - 10) + ")")
          .call(drag);

        var rx, ry;
        if (el.getWidth() > el.getHeight()) {
          rx = radius;
          ry = radius / 1.2;
        } else {
          rx = radius / 1.2;
          ry = radius;
        }
        //      vis.append('rect')
        //        .attr('x', -rx)
        //        .attr('y', -ry)
        //        .attr('width', rx * 2)
        //        .attr('height', ry * 2)
        //        .style('fill', 'white')
        //        .style('fill-opacity', '1');

        var nodes = tree.nodes(this.selection);

        var link = vis.selectAll("path.link")
          .data(tree.links(nodes))
          .enter().append("path")
          .attr("class", "link")
          .attr("d", diagonal);

        var node = vis.selectAll("g.node")
          .data(nodes)
          .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
          });

        var _this = this;
        var circle = node.append("circle")
          .style('pointer-events', 'all')
          .attr("r", 4.5)
          .on('mouseover', function(d) {
            d3.select(this)
              .style('stroke', '#f00');
          })
          .on('mouseout', function(d) {
            d3.select(this)
              .style('stroke', 'steelblue');
          })
          .on('click', function(d) {
            if (d.nameTag && (d.children == null || d.children.length == 0)) {
              _this.showPanel(d.nameTag);
              d3.select("#ui-wheel").selectAll("div").remove();
            }
          });

        var hammer = new Hammer(circle[0][0], {
          tap_max_interval: 700 // seems to bee needed for IE8
        });

        hammer.ontap = function(e) {
          _this.selection = circle[0][0].__data__;
          d3.select("#ui-wheel").selectAll("div").remove();
          _this.show([e.originalEvent.pageX, e.originalEvent.pageY]);
        };


        node.append("text")
          .attr("dx", function(d) {
            return d.x < 180 ? 8 : -8;
          })
          .attr("dy", ".31em")
          .attr('fill', '#eeeeee')
          .attr("text-anchor", function(d) {
            return d.x < 180 ? "start" : "end";
          })
          .attr("transform", function(d) {
            return d.x < 180 ? null : "rotate(180)";
          })
          .style('font-weight', 'bold')
          .style('font-size', '14')
          .text(function(d) {
            return d.text;
          });
      },

      panelOut: false,

      showPanel: function(nameTag) {
        if (!this.panelOut) {
          d3.select('#obj-exp').transition().duration(1000).style('left', '0px');
        } else {
          //        d3.select('#obj-exp').transition().duration(1000).style('left', '-500px');
        }
        this.panelOut = !this.panelOut;
        Ext.getCmp('obj-cat').setVisible(false);
        Ext.getCmp('obj-cat').removeAll();


        Ext.getCmp('objExtBtnSearchFieldId').setValue();
        var objExpPanel = Ext.getCmp('obj-exp');
        if (objExpPanel) {
          //移除组建
          objExpPanel.show();
          objExpPanel.removeAll();
        }
        var objExpPanel = Ext.getCmp('obj-details');
        if (objExpPanel) {
          objExpPanel.show();
          objExpPanel.removeAll();
        }
        //查询Scenario
        var queryParam = Ext.getCmp('objExtBtnSearchFieldId').getValue();
        try {
          eval("fn_menu_" + nameTag + "()");
        } catch (e) {
          console.log(e.message, e.stack)
          cometdfn.publish({
            MODULE_TYPE: nameTag,
            COMMAND: 'COMMAND_QUERY_LIST',
            queryParam: queryParam
          });
        }
        return;
      },

      reportOut: false,

      showDetail: function() {


        if (this.reportOut) {
          //d3.select('#obj-details').transition().duration(1000).style('left', '-1000px');
          //        this.reportOut = false;
          return;
        }
        //      d3.select("#obj-details").select(".x-panel-body")
        d3.select("#obj-details").select(".x-panel-body")
          .style('width', null)
          .style('height', null)
          .style('top', 0)
          .style('left', 0)
          .style('bottom', 0)
          .style('right', 0)
          .select("svg").remove();

        if (!this.reportOut) {
          var el = document.getElementsByClassName('ui-workbench')[0];
          var w = el.clientWidth - 290;
          var h = el.clientHeight;
          //          d3.select('#obj-details')
          d3.select('#obj-details')
            .style('position', 'absolute')
            .style('left', '-1000px')
            .style('width', w + 'px')
            .style('height', h + 'px')
            .classed('x-hide-display', null)
            .transition().duration(1000).style('left', parseInt(d3.select("#obj-exp").style('width'), 10) + 5 + 'px');
          this.reportOut = true;
        }
      },

      showReport: function(data) {
        if (!data.length && this.reportOut) {
          //        d3.select('#obj-details').transition().duration(1000).style('left', '-1000px');
          d3.select('#obj-details').transition().duration(1000).style('left', '-1000px');

          this.reportOut = false;
          return;
        }

        //      d3.select("#obj-details").select(".x-panel-body")
        d3.select("#obj-details").select(".x-panel-body")
          .style('width', null)
          .style('height', null)
          .style('top', 0)
          .style('left', 0)
          .style('bottom', 0)
          .style('right', 0)
          .select("svg").remove();

        if (data.length && !this.reportOut) {
          var el = document.getElementsByClassName('ui-workbench')[0];
          var w = el.clientWidth - 290;
          var h = el.clientHeight;
          //          d3.select('#obj-details')
          d3.select('#obj-details')
            .style('position', 'absolute')
            .style('left', '-1000px')
            .style('width', w + 'px')
            .style('height', h + 'px')
            .classed('x-hide-display', null)
            .transition().duration(1000).style('left', '280px');
          this.reportOut = true;
        }

        function x(d) {
          return d.income;
        }

        function y(d) {
          return d.lifeExpectancy;
        }

        function radius(d) {
          return d.population;
        }

        function color(d) {
          return d.region;
        }

        function key(d) {
          return d.name;
        }
      }
    }
  }
  $.fn.wheel = function(options) {
    var w = this.data('wheel');
    if (!w) {
      w = new wheel(this, options);
      this.data('wheel', w);
    }
    return w;
  };
})();

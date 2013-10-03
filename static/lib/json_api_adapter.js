/*! 
 * ember-json-api
 * Built on 2013-10-02
 * http://github.com/daliwali/ember-json-api
 * Copyright (c) 2013 Dali Zheng
 */
(function() {
"use strict";
var get = Ember.get, isNone = Ember.isNone;

DS.JsonApiSerializer = DS.RESTSerializer.extend({

  /**
   * Patch the extractSingle method, since there are no singular records
   */
  extractSingle: function(store, primaryType, payload, recordId, requestType) {
    var primaryTypeName = primaryType.typeKey;
    var json = {};
    for(var key in payload) {
      var typeName = Ember.String.singularize(key);
      if(typeName === primaryTypeName && Ember.isArray(payload[key])) {
        json[typeName] = payload[key][0];
      } else {
        json[key] = payload[key];
      }
    }
    return this._super(store, primaryType, json, recordId, requestType);
  },

  /**
   * Flatten links
   */
  normalize: function(type, hash, prop) {
    var json = {};
    for(var key in hash) {
      if(key !== 'links') {
        json[key] = hash[key];
      } else if(typeof hash[key] === 'object') {
        for(var link in hash[key]) {
          json[link] = hash[key][link];
        }
      }
    }
    return this._super(type, json, prop);
  },

  /**
   * Extract top-level "meta" & "links" before normalizing.
   */
  normalizePayload: function(type, payload) {
    if(payload.meta) {
      this.extractMeta(type, payload.meta);
      delete payload.meta;
    }
    if(payload.links) {
      this.extractLinks(type, payload.links);
      delete payload.links;
    }
    return payload;
  },

  /**
   * Override this method to parse the top-level "meta" object per type.
   */
  extractMeta: function(type, meta) {
    // no op
  },

  /**
   * Parse the top-level "links" object.
   */
  extractLinks: function(type, links) {
    var link, key, value, route;

    for(link in links) {
      key = link.split('.').pop();
      value = links[link];
      if(typeof value === 'string') {
        route = value;
      } else {
        key = value.type || key;
        route = value.href;
      }

      // strip base url
      if(route.substr(0, 4).toLowerCase() === 'http') {
        route = route.split('//').pop().split('/').slice(1).join('/');
      }

      // strip prefix slash
      if(route.charAt(0) === '/') {
        route = route.substr(1);
      }

      DS.set('_routes.' + Ember.String.singularize(key), route);
    }
  },

  // SERIALIZATION

  /**
   * Use "links" key, remove support for polymorphic type
   */
  serializeBelongsTo: function(record, json, relationship) {
    var key = relationship.key;
    var belongsTo = get(record, key);

    if (isNone(belongsTo)) return;

    json.links = json.links || {};
    json.links[key] = get(belongsTo, 'id');
  },

  /**
   * Use "links" key
   */
  serializeHasMany: function(record, json, relationship) {
    var key = relationship.key;

    var relationshipType = DS.RelationshipChange.determineRelationshipType(record.constructor, relationship);

    if (relationshipType === 'manyToNone' || relationshipType === 'manyToMany') {
      json.links = json.links || {};
      json.links[key] = get(record, key).mapBy('id');
    }
  }

});

}).call(this);

(function() {
"use strict";
var get = Ember.get;

/**
 * Keep a record of routes to resources by type.
 */
DS._routes = {};

DS.JsonApiAdapter = DS.RESTAdapter.extend({

  defaultSerializer: 'DS/jsonApi',

  /**
   * Look up routes based on top-level links.
   */
  buildURL: function(type, id) {
    var route = DS._routes[type];
    if(!!route) {
      var url = [],
          host = get(this, 'host'),
          prefix = this.urlPrefix(),
          param = new RegExp('\{(.*?)\}', 'g');

      if (id) {
        if(route.match(param)) {
          url.push(route.replace(param, id));
        } else {
          url.push(route, id);
        }
      } else {
        url.push(route.replace(param, ''));
      }

      if (prefix) { url.unshift(prefix); }

      url = url.join('/');
      if (!host && url) { url = '/' + url; }

      return url;
    }
    return this._super(type, id);
  },

  /**
   * Fix query URL.
   */
  findMany: function(store, type, ids, owner) {
    return this.ajax(this.buildURL(type.typeKey), 'GET', {data: {ids: ids.join(',')}});
  },

  /**
   * Cast individual record to array,
   * and match the root key to the route
   */
  createRecord: function(store, type, record) {
    var data = {};
    data[this.pathForType(type.typeKey)] = [
      store.serializerFor(type.typeKey).serialize(record, {includeId: true})
    ];

    return this.ajax(this.buildURL(type.typeKey), "POST", {data: data});
  },

  /**
   * Cast individual record to array,
   * and match the root key to the route
   */
  updateRecord: function(store, type, record) {
    var data = {};
    data[this.pathForType(type.typeKey)] = [
      store.serializerFor(type.typeKey).serialize(record)
    ];

    var id = get(record, 'id');

    return this.ajax(this.buildURL(type.typeKey, id), "PUT", {data: data});
  }

});

}).call(this);

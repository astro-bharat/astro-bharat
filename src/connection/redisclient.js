/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-useless-return */
/* eslint-disable no-unused-vars */
/**
 * @ module RedisClient
 */

const Redis = require('ioredis');
const _ = require('lodash');

const redisClient = {};

const fs = require('fs');

const logger = require('../features/logger');

/* eslint-disable no-negated-condition */
function errorListener(err) {
    if (!logger.info.enabled) {
        logger.info(err.stack);
    } else {
        logger.error(err);
    }
}

function sanitizeRedisConfiguration(options) {
    logger.silly('sanitizeRedisConfiguration::start');

    options = options || {};

    logger.silly(`deployment_type = ${options.deployment_type}`);

    if (!options.deployment_type || options.deployment_type === 'single') {
        delete options.sentinels;
        delete options.name;
        delete options.clusters;
    }

    if (options.deployment_type === 'sentinel') {
        delete options.host;
        delete options.port;
        delete options.clusters;
    }

    if (options.deployment_type === 'cluster') {
        delete options.host;
        delete options.port;
        delete options.name;
        delete options.sentinels;
    }

    logger.isSillyEnabled('sanitizeRedisConfiguration::end');

    return options;
}

function sanitizeSSlConfiguration(sslOptions) {
    if (!sslOptions) {
        return sslOptions;
    }

    sslOptions.ca = resolveCertificates(sslOptions.ca);
    sslOptions.key = resolveCertificates(sslOptions.key);
    sslOptions.cert = resolveCertificates(sslOptions.cert);
    sslOptions.crl = resolveCertificates(sslOptions.crl);
    sslOptions.pfx = resolveCertificates(sslOptions.pfx);

    if (sslOptions.serverIdentities && sslOptions.serverIdentities.length) {
        sslOptions.checkServerIdentity = function (server, cert) {
            if (sslOptions.serverIdentities.indexOf(server) > -1) {
                return;
            }

            throw new Error('certificate mismatch');
        };
    }

    if (sslOptions.allowHosts) {
        sslOptions.checkServerIdentity = function (server, cert) {
            return;
        };
    }

    return sslOptions;
}

function resolveCertificates(file) {
    if (_.isArray(file)) {
        return file.map(c => fs.readFileSync(c));
    }

    if (file) {
        return [fs.readFileSync(file)];
    }

    return file;
}

/**
 * Create a redis client with given options
 * falling back to defaults otherwise
 *
 * @param {Object} opts
 * !!! [ deprecated ] opts.redis to enforce ioredis for it supports sentinel & cluster deployments !!!
 * @param {Object}  [opts.redis=redis] - redis client library
 * @param {Function} [opts.errorListener = errorListener]
 * @param {String} [opts.name] - name of the service
 * @param {Object} [opts.options={}] - options for redis.createClient
 * @param {String} [cache_key] - if provided, cache the redis client with the given cahce_key
 *
 * @returns {Object} RedisClient
 */

function createClient(opts, cache_key) {
    let client;
    opts = opts || defaults;
    opts.options = opts.options || defaults.options;
    opts = _.cloneDeep(opts);

    logger.verbose(`creating client for ${opts.name}`);

    if (isRedisClientCached(cache_key)) {
        return getCachedRedisClient(cache_key);
    }

    opts.options = sanitizeRedisConfiguration(opts.options);
    handleSSLEnabled(opts.options);

    const reconnectOnError = opts.reconnectOnError || config.redis.reconnectOnError;
    handleReconnectOnError(reconnectOnError);

    client = createRedisClient(opts);

    handleErrorListener(opts, client);
    cacheRedisClient(cache_key, client);

    return client;
}

// Other helper functions go here...

exports.createClient = createClient;


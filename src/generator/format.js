'use strict';

const yaml = require('js-yaml');
const errors = require('../errors');
const templates = require('../templates/static');
const i = require('dedent-js');

const DOCUMENT_PREFIX = '---';

exports.render = function (plays, remediation) {

    return [
        createHeader(remediation),
        ...plays.map(renderPlay)
    ].join('\n\n');
};

exports.validate = function (playbook) {
    if (playbook.includes('@@')) {
        throw errors.internal.playbookValidationFailed(new Error('playbook not fully rendered'), playbook);
    }

    // crosscheck that what we generated is a valid yaml document
    let parsed;
    try {
        parsed = yaml.safeLoad(playbook);
    } catch (e) {
        throw errors.internal.playbookValidationFailed(e, playbook);
    }

    if (!Array.isArray(parsed)) {
        throw errors.internal.playbookValidationFailed(new Error('expected playbook to be an array of plays'), playbook);
    }

    return playbook;
};

function createHeader (remediation) {
    const parts = [
        DOCUMENT_PREFIX,
        templates.special.disclaimer.render()
    ];

    remediation && parts.push(createRemediationHeader(remediation));
    return parts.join('\n');
}

function createRemediationHeader (remediation) {
    return i`
        #
        # ${remediation.name}
        # https://cloud.redhat.com/insights/remediations/${remediation.id}
        # Generated by Red Hat Insights on ${new Date().toUTCString()}`;
}

function renderPlay (play) {
    try {
        return play.render();
    } catch (e) {
        throw errors.internal.playbookRenderingFailed(e, play.id.full);
    }
}

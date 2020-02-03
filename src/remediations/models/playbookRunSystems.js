'use strict';

module.exports = (sequelize, {UUID, ENUM, STRING, DATE, TEXT, INTEGER}) => {
    const RunSystems = sequelize.define('playbook_run_systems', {
        id: {
            type: UUID,
            primaryKey: true
        },
        system_id: {
            type: UUID,
            allowNull: false
        },
        system_name: {
            type: STRING,
            allowNull: false
        },
        status: {
            type: ENUM,
            values: ['pending', 'running', 'success', 'failure', 'canceled'],
            defaultValue: 'pending',
            allowNull: false
        },
        sequence: {
            type: INTEGER,
            allowNull: false,
            defaultVaule: -1
        },
        console: {
            type: TEXT,
            allowNull: false
        },
        updated_at: {
            type: DATE,
            allwoNull: false
        },
        run_executor_id: {
            type: UUID,
            allowNull: false
        }
    }, {
        timestamps: true,
        updatedAt: 'updated_at'
    });

    RunSystems.associate = models => {
        RunSystems.belongsTo(models.playbook_run_executors, {
            foreignKey: 'playbook_run_executor_id'
        });
    };

    return RunSystems;
};

function getClosestEmptyId(db, tableName, callback) {
    db.all(`SELECT id FROM ${tableName} ORDER BY id ASC`, [], (err, rows) => {
        if (err) {
            return callback(err);
        }

        let candidate = 1;
        for (const row of rows) {
            if (row.id === candidate) {
                candidate += 1;
            } else if (row.id > candidate) {
                break;
            }
        }

        callback(null, candidate);
    });
}

function checkDuplicateId(db, tableName, id, callback) {
    db.get(`SELECT id FROM ${tableName} WHERE id = ?`, [id], (err, row) => {
        if (err) {
            return callback(err);
        }
        callback(null, Boolean(row));
    });
}

module.exports = {
    getClosestEmptyId,
    checkDuplicateId
};

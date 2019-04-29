
let config = {};db = [];
for(let i = 1 ; i < 17 ; i++){
    db.push({
        logo:`assets/img/index/nav/${i}.png`,
        company:`assets/img/index/list/${i}/company.png`,
        desc:`assets/img/index/list/${i}/desc.png`,
        img:`assets/img/index/list/${i}/img.png`,
    })
}
config.db = db;
// export default db;
module.exports = config;
<template>
  <div id="app">
    <div class="list">
      <ul>
        <li class="header">
          <span class="team">球队：</span>
          <span class="data">净胜分：</span>
        </li>
        <li v-for="(item, index) in effectRank" :key="index">
          <span class="team">{{ index + 1 }}. {{ item.team_name }}</span>
          <span class="data">{{ item.point_diff }}</span>
        </li>
      </ul>
      <ul>
        <li class="header">
          <span class="team">球队：</span>
          <span class="data">得分：</span>
        </li>
        <li v-for="(item, index) in bounsRank" :key="index">
          <span class="team">{{ index + 1 }}. {{ item.team_name }}</span>
          <span class="data">{{ item.points_for }}</span>
        </li>
      </ul>
      <ul>
        <li class="header">
          <span class="team">球队：</span>
          <span class="data">失分：</span>
        </li>
        <li v-for="(item, index) in loseRank" :key="index">
          <span class="team">{{ index + 1 }}. {{ item.team_name }}</span>
          <span class="data">{{ item.points_against }}</span>
        </li>
      </ul>
    </div>
    <div class="team_input">
      <input @change="teamEnter($event, 'guest')" placeholder="客队">
      <span>VS</span>
      <input @change="teamEnter($event, 'host')" placeholder="主队">
    </div>
    <div class="team_diff" v-show="team_diff_flag">
      <ul class="diff_list">
        <li v-for="(item, index) in team_diff_arr_final" :key="index">
          <span class="item_guest">{{ item.score.guest }}</span>
          <span class="item_item">{{ wordMap[item.item] }}: </span>
          <span class="item_host">{{ item.score.host }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
    name: 'app',
    data() {
      return {
        effectRank: [],
        bounsRank: [],
        loseRank: [],
        teamTidMap: [],
        wordMap: {
          points: "得分",
          rebounds: "篮板",
          assists: "助攻",
          steals: "抢断",
          turnovers: "失误",
          blocks: "盖帽",
        },
        team_diff_arr: [],
        team_diff_arr_final: [],
        team_diff_flag: false
      }
    },
    created() {
      this.getAllTeamTid();
      this.$axios.get('/api?p=radar&p=radar&s=team_standing&a=conference&_='+ (new Date()).getTime()).then( res => {
          let tempRes = [...res.data.result.data.eastern, ...res.data.result.data.western];
          let wholeTeam = this.deepClone(tempRes);
          let wholeTeamLose = this.deepClone(tempRes);
          let wholeTeamBouns = this.deepClone(tempRes);
          this.effectRank = wholeTeam.sort((a, b) => { return b.point_diff - a.point_diff });
          this.bounsRank = wholeTeamBouns.sort((a, b) => { return b.points_for - a.points_for });
          this.loseRank = wholeTeamLose.sort((a, b) => { return a.points_against - b.points_against });
        })
    },
    methods: {
      getAllTeamTid() {
        this.$axios.get('api?p=radar&p=radar&s=team&a=hireracy&_=' + (new Date()).getTime()).then( res => {
          let tempRes = res.data.result.data;
          for( let key in tempRes) {
            for( let keys in tempRes[key]) {
              this.teamTidMap = this.teamTidMap.concat(tempRes[key][keys]);
            }
          }
        })
      },
      getSingleTeamData(tid, type) {
        this.$axios.get(`/api?p=radar&p=radar&s=leaders&a=team&tid=${tid}&_=` + (new Date()).getTime()).then( res => {
          if(type === 'guest') {
            this.team_diff_arr.guest_team = res.data.result.data.reg.average;
            if(this.team_diff_arr.host_team) {
              this.team_diff_flag = true;
            }
          } else {
            this.team_diff_arr.host_team = res.data.result.data.reg.average;
            if(this.team_diff_arr.guest_team) {
              this.team_diff_flag = true;
            }
          }
          if(this.team_diff_flag) {
            for(let i = 0,len = this.team_diff_arr.guest_team.length; i < len; i ++) {
              if(this.wordMap[this.team_diff_arr.guest_team[i].item]) {
                let itemS = this.team_diff_arr.guest_team[i].item;
                let tempObj = {};
                tempObj.item = itemS;
                tempObj.score = {
                    guest: this.team_diff_arr.guest_team[i].score,
                    host: this.team_diff_arr.host_team[i].score
                }
                this.team_diff_arr_final.push(tempObj);
              }
            }
          }
        });
      },
      teamEnter(e, type) {
        let value = e.target.value;
        let team_tip = '';
        for(let i = 0, len = this.teamTidMap.length;i < len;i ++) {
          if(value === this.teamTidMap[i].team_name_cn) {
            team_tip = this.teamTidMap[i].tid;
          }
        }
        this.getSingleTeamData(team_tip, type);
      },
      deepClone(tar) {
        let result = Array.isArray(tar) ? [] : {};
        for(let key in tar) {
          if(tar.hasOwnProperty(key)) {
            if(typeof tar[key] === 'object' && tar[key] !== null) {
              result[key] = this.deepClone(tar[key]);
            } else {
              result[key] = tar[key];
            }
          }
        }
        return result;
      }
    }
}
</script>

<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
  }
  .list{
    display: flex;
    width: 100vw;
    ul{
      flex: 1;
      li {
        padding: 2px 0;
        border-bottom: 1px solid #ebebeb;
        span{
          padding-left: 10px;
          display: inline-block;
          width: 33.33%;
          font-size: 16px;
        }
        .data{
          color: #0044ff;
        }
      } 
      .header{
        background-color: #428cdb;
        padding: 7px 0;
        border-bottom: none;
        span{
          color: #fff;
        }
      }
    }
  }
  .team_input{
    display: flex;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    span{
      display: inline-block;
      margin: 0 20px;
      width: 80px;
      text-align: center;
    }
    input{
      border: solid 1px #ececec;
      border-radius: 2px;
      padding: 4px 0 4px 12px;
      font-size: 14px;
    }
  }
  .team_diff{
    display: flex;
    margin-top: 30px;
    justify-content: center;
    align-items: center;
    text-align: center;
    .diff_list{
      li {
        display: flex;
        .item_guest{
          text-align: right;
          width: 100px;
        }
        .item_host{
          text-align: left;
          width: 100px;
        }
        .item_item{
          display: inline-block;
          width: 120px;
        }
      }
    }
  }
</style>

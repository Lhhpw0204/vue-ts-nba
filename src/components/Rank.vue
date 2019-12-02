<template>
  <div>
    <div class="list">
      <ul>
        <li class="header">
          <span class="team">Team：</span>
          <span class="data">净胜分：</span>
        </li>
        <li v-for="(item, index) in effectRank" :key="index">
          <span class="team" @click="goToTeamS(item.team_name)">{{ index + 1 }}. {{ item.team_name + " (" + item.wins + " - " + item.losses + ")" }}</span>
          <span class="data">{{ item.point_diff }}</span>
        </li>
      </ul>
      <ul>
        <li class="header">
          <span class="team">Team：</span>
          <span class="data">得分：</span>
        </li>
        <li v-for="(item, index) in bounsRank" :key="index">
          <span class="team" @click="goToTeamS(item.team_name)">{{ index + 1 }}. {{ item.team_name + " (" + item.wins + " - " + item.losses + ")" }}</span>
          <span class="data">{{ item.points_for }}</span>
        </li>
      </ul>
      <ul>
        <li class="header">
          <span class="team">Team：</span>
          <span class="data">失分：</span>
        </li>
        <li v-for="(item, index) in loseRank" :key="index">
          <span class="team" @click="goToTeamS(item.team_name)">{{ index + 1 }}. {{ item.team_name + " (" + item.wins + " - " + item.losses + ")" }}</span>
          <span class="data">{{ item.points_against }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {myMixin} from "../../assets/mixins"

  export default {
    mixins: [myMixin],
    name: "Rank",
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
        team_diff_arr_final: []
      }
    },
    created() {
      document.title = "排名";
      this.getAllTeamTid();
      this.$axios.get('/api?p=radar&p=radar&s=team_standing&a=conference&_='+ (new Date()).getTime()).then( res => {
          let tempRes = [...res.data.result.data.eastern, ...res.data.result.data.western];
          let wholeTeam = this.tools.deepClone(tempRes);
          let wholeTeamLose = this.tools.deepClone(tempRes);
          let wholeTeamBouns = this.tools.deepClone(tempRes);
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
      goToTeamS(url) {
        this.goToTeam(this, {name: url});
      }
    }
  }
</script>

<style lang="scss" scoped>
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
          width: 50%;
          font-size: 14px;
          &.team{
            cursor: pointer;
          }
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
</style>

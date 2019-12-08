<template>
  <div class="team">
    <ul class="team_self">
      <li class="team_match_title">
        <span v-for="(item, index) in teamTitle" :key="index">{{item.type}}</span>
      </li>
      <li v-for="(item, index) in teamList" :key="index">
        <span>{{ item.field_goals_made + "-" + item.field_goals_att + " (" + (item.field_goals_pct * 100).toFixed(2) + "%" + ")" }}</span>
        <span>{{ item.three_points_made + "-" + item.three_points_att + " (" + (item.three_points_pct * 100).toFixed(2) + "%" + ")" }}</span>
        <span>{{ item.free_throws_made + "-" + item.free_throws_att + " (" + (item.free_throws_pct * 100).toFixed(2) + "%" + ")" }}</span>
        <span>{{ item.wins }}</span>
        <span>{{ item.losses }}</span>
        <span>{{ item.points }}</span>
        <span>{{ item.offensive_rebounds }}</span>
        <span>{{ item.defensive_rebounds }}</span>
        <span>{{ item.rebounds }}</span>
        <span>{{ item.assists }}</span>
        <span>{{ item.turnovers }}</span>
        <span>{{ item.assists_turnover_ratio }}</span>
        <span>{{ item.steals }}</span>
        <span>{{ item.blocks }}</span>
        <span>{{ item.personal_fouls }}</span>
      </li>
    </ul>
    <ul class="match_list">
      <li class="team_match_title">
        <span v-for="(item, index) in matchTitle" :key="index">{{item.type}}</span>
      </li>
      <li v-for="(item, index) in matchList" :key="index">
        <span>{{ item.date }}</span>
        <span @click="goToTeamS(item.opp_team_name)">{{ item.points + '-' + item.opp_score + " " + item.opp_team_name }}</span>
        <span>{{ item.host ? "主" : "客" }}</span>
        <span :class="[item.score > item.opp_score ? 'item_win' : 'item_lose']">{{ item.score > item.opp_score ? "胜": "负" }}</span>
        <span>{{ item.field_goals_made + "-" + item.field_goals_att + " (" + item.field_goals_pct + "%" + ")" }}</span>
        <span>{{ item.three_points_made + "-" + item.three_points_att + " (" + item.three_points_pct + "%" + ")" }}</span>
        <span>{{ item.free_throws_made + "-" + item.free_throws_att + " (" + item.free_throws_pct + "%" + ")" }}</span>
        <span>{{ item.offensive_rebounds }}</span>
        <span>{{ item.defensive_rebounds }}</span>
        <span>{{ item.rebounds }}</span>
        <span>{{ item.assists }}</span>
        <span>{{ item.turnovers }}</span>
        <span>{{ item.steals }}</span>
        <span>{{ item.blocks }}</span>
        <span>{{ item.personal_fouls }}</span>
      </li>
    </ul>
    <ul class="match_page">
      <li v-for="(item, index) in pageNum" :key="index" @click="jump(item)" :class="[currPage === (index + 1) ? 'active' : '']">{{ item }}</li>
    </ul>
  </div>
</template>

<script>
  import {myMixin} from "../../assets/mixins"
  import { mapState } from "vuex"

  export default {
    mixins: [myMixin],
    name: "home",
    data() {
      return {
        teamTitle: [		
          {type: "投篮(%)"},
          {type: "三分(%)"},
          {type: "罚球(%)"},
          {type: "胜"},
          {type: "负"},
          {type: "得分"},
          {type: "前场板"},
          {type: "后场板"},
          {type: "总篮板"},
          {type: "助攻"},
          {type: "失误"},
          {type: "助失比"},
          {type: "抢断"},
          {type: "盖帽"},
          {type: "犯规"}
        ],
        matchTitle: [		
          {type: "日期"},
          {type: "比赛"},
          {type: "主客场"},
          {type: "赛果"},
          {type: "投篮(%)"},
          {type: "三分(%)"},
          {type: "罚球(%)"},
          {type: "前场板"},
          {type: "后场板"},
          {type: "总篮板"},
          {type: "助攻"},
          {type: "失误"},
          {type: "抢断"},
          {type: "盖帽"},
          {type: "犯规"}
        ],
        teamList: [],
        matchList: [],
        currPage: 1,
        teamTid: "",
        pageNum:[]
      }
    },
    computed: {
      ...mapState({
        teamsTid: 'teamsTid'
      })
    },
    created() {
      document.title = "球队数据-" + this.$route.query.name;
      this.getTeamTid();
    },
    methods: {
      getTeamTid() {
        let teamName = this.$route.query.name;
        for(let i = 0,len = this.teamsTid.length;i < len; i ++) {
          if(teamName === this.teamsTid[i].team_name_cn) {
            this.teamTid = this.teamsTid[i].tid;
            this.getTeamMatchData(this.teamsTid[i].tid);
            this.getTeamAvarageData(this.teamsTid[i].tid);
            break;
          }
        }
      },
      getTeamMatchData(tid) {
        this.$axios.get(`api?p=radar&p=radar&s=summary&a=team&tid=${tid}&season=2019&season_type=reg&page=${this.currPage}&limit=20&_=` + (new Date()).getTime()).then( res => {
          this.matchList = res.data.result.data.games;
          let matchTotal = Math.ceil(res.data.result.data.paginator.total/20);
          this.pageNum = new Array(matchTotal).fill().map( (_, index) => {
            return index + 1;
          });
        })
      },
      getTeamAvarageData(tid) {
        this.$axios.get(`api?p=radar&p=radar&s=stats&a=team_season&tid=${tid}&season_type=reg&split=average&_=` + (new Date()).getTime()).then( res => {
          let tempRes = res.data.result.data.teams[0];
          this.teamList = [tempRes];
        }) 
      },
      goToTeamS(url) {
        this.goToTeam(this, {name: url});
      },
      jump(page) {
        this.currPage = page;
        this.getTeamMatchData(this.teamTid);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .team{
    ul{
      li{
        display: flex;
        line-height: 45px;
        text-align: center;
        border-bottom: 1px solid #ebebeb;
        &:hover{
          background: #e4e2f9;
        }
        &.team_match_title{
          line-height: 40px;
          background: #428cdb;
          color: #fff;
        }
        span{
          display: inline-block;
          padding: 0 4px;
          flex: 1;
          &.item_win{
            color: #428cdb;
          }
          &.item_lose{
            color: #f30;
          }
        }
      }
    }
    .match_list{
      margin-bottom: 40px;
      li {
        span{
          cursor: pointer;
          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(5),
          &:nth-child(6),
          &:nth-child(7){
            flex-basis: 80px;
          }
        }
      }
    }
    .team_self{
      margin: 40px 0;
      li {
        span{
          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(3){
            flex-basis: 110px;
          }
        }
      }
    }
    .match_page{
      display: flex;
      align-items: center;
      justify-content: center;
      li{
        display: inline-block;
        margin: 0 1px;
        width: 36px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        border: solid 1px rgba(0,0,0,0.3);
        cursor: pointer;
        &.active{
          background: #428cdb;
          color: #fff;
        }
      }
    }
  }
</style>

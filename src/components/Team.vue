<template>
  <div class="team">
    <ul>
      <li class="team_match_title">
        <span v-for="(item, index) in matchTitle" :key="index">{{item.type}}</span>
      </li>
      <li v-for="(item, index) in matchList" :key="index">
        <span>{{ item.date }}</span>
        <span>{{ item.points + '-' + item.opp_score + item.opp_team_name }}</span>
        <span>{{ item.host ? "主" : "客" }}</span>
        <span :class="[item.score > item.opp_score ? 'item_win' : 'item_lose']">{{ item.score > item.opp_score ? "胜": "负" }}</span>
        <span>{{ item.field_goals_made + "-" + item.field_goals_att }}</span>
        <span>{{ item.field_goals_pct + "%" }}</span>
        <span>{{ item.three_points_made + "-" + item.three_points_att }}</span>
        <span>{{ item.three_points_pct + "%" }}</span>
        <span>{{ item.free_throws_made + "-" + item.free_throws_att }}</span>
        <span>{{ item.free_throws_pct + "%" }}</span>
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
  </div>
</template>

<script>
  import { mapState } from "vuex"
  export default {
    name: "home",
    data() {
      return {
        matchTitle: [		
          {type: "日期"},
          {type: "比赛"},
          {type: "主客场"},
          {type: "赛果"},
          {type: "投篮"},
          {type: "投篮%"},
          {type: "三分"},
          {type: "三分%"},
          {type: "罚球"},
          {type: "罚球%"},
          {type: "前场板"},
          {type: "后场板"},
          {type: "总篮板"},
          {type: "助攻"},
          {type: "失误"},
          {type: "抢断"},
          {type: "盖帽"},
          {type: "犯规"}
        ],
        matchList: []
      }
    },
    computed: {
      ...mapState({
        teamsTid: 'teamsTid'
      })
    },
    created() {
      this.getTeamTid();
    },
    methods: {
      getTeamTid() {
        let teamName = this.$route.query.name;
        for(let i = 0,len = this.teamsTid.length;i < len; i ++) {
          if(teamName === this.teamsTid[i].team_name_cn) {
            this.getTeamMatchData(this.teamsTid[i].tid);
            break;
          }
        }
      },
      getTeamMatchData(tid) {
        this.$axios.get(`api?p=radar&p=radar&s=summary&a=team&tid=${tid}&season=2019&season_type=reg&page=1&limit=20&_=` + (new Date()).getTime()).then( res => {
          this.matchList = res.data.result.data.games
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .team{
    ul{
      li{
        display: flex;
        line-height: 30px;
        text-align: center;
        &.team_match_title{
          line-height: 40px;
          background: #428cdb;
          color: #fff;
        }
        span{
          display: inline-block;
          padding: 0 4px;
          flex: 1;
          &:nth-child(1),
          &:nth-child(2){
            flex-basis: 100px;
          }
          &.item_win{
            color: #428cdb;
          }
          &.item_lose{
            color: #f30;
          }
        }
      }
    }
  }
</style>

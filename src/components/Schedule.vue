<template>
  <div class="schedule">
    <div  v-for="(item, index) in scheDuleList" :key="index">
      <h2 class="schedule_date">{{ item.date }}</h2>
      <ul class="schedule_ul">
        <li v-for="(itemC, indexC) in item.matchs" :key="indexC">
          <span class="schedule_time">{{itemC.time}}</span>
          <p class="schedule_team">
            <span :class="['schedule_team_away', itemC.away_score ? itemC.away_score > itemC.home_score ? 'schedule_win' : 'schedule_lose' : '']">
              <span @click="goToTeamS(itemC.away_name)">{{itemC.away_name}}</span>
              <span v-show="itemC.away_score">{{itemC.away_score}}</span>
            </span>
            <span class="schedule_team_vs" @click="gotoCompare(index,indexC)"> —— </span>
            <span :class="['schedule_team_home', itemC.away_score ? itemC.away_score > itemC.home_score ? 'schedule_lose' : 'schedule_win' : '']">
              <span @click="goToTeamS(itemC.home_name)">{{itemC.home_name}}</span>
              <span v-show="itemC.home_score">{{itemC.home_score}}</span>
            </span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {myMixin} from "../../assets/mixins"

  export default {
    mixins: [myMixin],
    name: "Schedule",
    data() {
      return {
        scheDuleList: [],
        scheduleSpan: 6
      }
    },
    created() {
      this.getSchedule();
      document.title = "赛程";
    },
    methods: {
      getSchedule() {
        let currDate = new Date();
        let currTime = currDate.getTime();
        let currYear = currDate.getFullYear();
        let currMonth = currDate.getMonth() + 1;
        let currDay = currDate.getDate();
        if(currMonth < 10) {
          currMonth = '0' + currMonth;
        }
        if(currDay < 10) {
          currDay = '0' + currDay;
        }
        let currDateParam = currYear + '-' + currMonth + '-' + currDay;
        this.$axios.get(`api?p=radar&p=radar&s=schedule&a=hireracy&a=date_span&date=${currDateParam}&span=${this.scheduleSpan}&_=` + currTime).then( res => {
          let tempMatchs = res.data.result.data.matchs;
          let obj = { date: "", matchs: []},
              newMatchs = [];
          tempMatchs.forEach( (item, index) => {
            if(!obj.date) {
              obj.date = item.date;
            }
            if (item.date !== obj.date) {
              newMatchs.push(obj);
              obj = { date: item.date, matchs: []};
            }
            obj.matchs.push(item);
            if(index === tempMatchs.length - 1) {
              newMatchs.push(obj);
            }
          });
          this.scheDuleList = newMatchs;
        })
      },
      gotoCompare(index, indexC) {
        let guestName = this.scheDuleList[index].matchs[indexC].away_name;
        let hostName = this.scheDuleList[index].matchs[indexC].home_name;
        const { href } = this.$router.resolve({
          path: 'compare',
          query: {
            guestName: guestName,
            hostName: hostName
          }
        })
        window.open(href, '_blank');
      },
      goToTeamS(url) {
        this.goToTeam(this, {name: url});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .schedule{
    margin: 0 auto 50px;
    width: 50%;
    min-width: 1000px;
    .schedule_date{
      display: block;
      margin: 40px 0 20px;
      font-size: 20px;
      line-height: 22px;
      font-weight: bold;
      color: #de254f;
      border-left: 3px solid #de254f;
      padding-left: 10px;
    }
    .schedule_ul{
      width: 100%;
      li{
        display: flex;
        &:nth-child(2n){
          background: #fafafa;
        }
        .schedule_time{
          padding-left: 12px;
          width: 100px;
          line-height: 52px;
          font-size: 18px;
          color: #999;
        }
        .schedule_team{
          font-size: 16px;
          font-weight: bold;
          line-height: 52px;
          text-align: left;
          span{
            display: inline-block;
            cursor: pointer;
          }
          .schedule_team_away{
            width: 120px;
            text-align: right;
          }
          .schedule_team_vs{
            width: 160px;
            text-align: center;
            color: #999;
            cursor: pointer;
          }
          .schedule_lose{
            color: #999;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="schedule">
    <h2 class="schedule_date">{{ scheDuleDate }}</h2>
    <ul class="schedule_ul">
      <li v-for="(item, index) in scheDuleList" :key="index">
        <span class="schedule_time">{{item.time}}</span>
        <p class="schedule_team">
          <span class="schedule_team_away">{{item.away_name}}</span>
          <span class="schedule_team_vs" @click="gotoCompare(index)"> —— </span>
          <span class="schedule_team_home">{{item.home_name}}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
  import tools from "../utils/tools"

  export default {
    name: "Schedule",
    data() {
      return {
        scheDuleDate: "",
        scheDuleList: []
      }
    },
    created() {
      this.getSchedule();
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
        this.scheDuleDate = currDateParam;
        this.$axios.get(`api?p=radar&p=radar&s=schedule&a=hireracy&a=date_span&date=${currDateParam}&span=1&_=` + currTime).then( res => {
          this.scheDuleList = res.data.result.data.matchs
        })
      },
      gotoCompare(index) {
        let guestName = this.scheDuleList[index].away_name;
        let hostName = this.scheDuleList[index].home_name;
        this.$router.push(`/compare?guestName=${guestName}&hostName=${hostName}`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .schedule{
    margin: 0 auto;
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
        }
      }
    }
  }
</style>

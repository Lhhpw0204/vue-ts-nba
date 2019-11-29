<template>
  <div class="compare">
    <div class="team_input">
      <input @input="handleEnterTeam($event, 'guest')" placeholder="guest" v-model="guestName"/>
      <span>VS</span>
      <input @input="handleEnterTeam($event, 'host')" placeholder="host" v-model="hostName"/>
    </div>
    <div class="team_diff">
      <ul class="diff_list">
        <li 
          v-for="(item, index) in team_diff_data" 
          :key="index"
          :class="{ 'diff_li_bg': wordMap[item.item] }">
          <div v-if="wordMap[item.item]">
            <span class="item_guest">{{ item.guest }}</span>
            <span class="item_item">{{ wordMap[item.item] ? wordMap[item.item] : item.item }}</span>
            <span class="item_host">{{ item.host }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import tools from "../utils/tools"

  export default {
    name: "Rank",
    data() {
      return {
        teamTidMap: [],
        wordMap: {
          points: "得分",
          rebounds: "篮板",
          assists: "助攻",
          steals: "抢断",
          turnovers: "失误",
          blocks: "盖帽",
          field_goals_pct: "命中率",
          three_points_att: "场均三分得分",
          three_points_pct: "三分命中率",
          assists_turnover_ratio: "助攻失误比",
          personal_fouls: "犯规",

        },
        guestName: "",
        hostName: "",
        team_diff_obj: {},
        team_diff_data: []
      }
    },
    created() {
      document.title = "球队比较-" + this.$route.query.guestName + "vs" + this.$route.query.hostName;
      this.getQuery();
    },
    methods: {
      async getQuery() {
        let query = this.$route.query;
        this.guestName = query.guestName;
        this.hostName = query.hostName;

        let teamTid = await this.$axios.get('api?p=radar&p=radar&s=team&a=hireracy&_=' + (new Date()).getTime());
        let tempRes = teamTid.data.result.data;
        this.teamTidMap = this.getAllTeamTip(tempRes);
        let guestTid = this.getTeamTid(this.guestName, this.teamTidMap);
        let hostTid = this.getTeamTid(this.hostName, this.teamTidMap);
        let guestAjax = this.getSingleTeamData(guestTid);
        let hostAjax = this.getSingleTeamData(hostTid);
        Promise.all([guestAjax, hostAjax]).then( (res) => {
          let guestData = res[0].data.result.data.reg.average,
              hostData = res[1].data.result.data.reg.average;
          guestData = guestData.sort( tools.selfSort("item"));
          hostData = hostData.sort( tools.selfSort("item"));
          for (let i = 0,len = guestData.length;i < len;i ++) {
            this.team_diff_data.push({
              item: guestData[i].item,
              guest: guestData[i].score,
              host: hostData[i].score
            })
          }
        })
        console.log(this.team_diff_data)
      },
      getTeamTid(currTeamName ,tids) {
        let currTeamTid = "";
        for(let i = 0, len = tids.length;i < len;i ++) {
          if(currTeamName === tids[i].team_name_cn) {
            currTeamTid = tids[i].tid;
            break;
          }
        }
        return currTeamTid;
      },
      getAllTeamTip(tar) {
        let tempTidMap = [];
        for( let key in tar) {
          for( let keys in tar[key]) {
            tempTidMap = tempTidMap.concat(tar[key][keys]);
          }
        }
        return tempTidMap;
      },
      handleEnterTeam: tools.debounce(function(e, type) {
        let value = e.target.value;
        let team_tip = '';
        for(let i = 0, len = this.teamTidMap.length;i < len;i ++) {
          if(value === this.teamTidMap[i].team_name_cn) {
            team_tip = this.teamTidMap[i].tid;
          }
        }
        this.getSingleTeamData(team_tip, type)
      }, 1000),
      getSingleTeamData(tid, type) {
        if(type) {
          this.$axios.get(`/api?p=radar&p=radar&s=leaders&a=team&tid=${tid}&_=` + (new Date()).getTime()).then( res => {
            this.team_diff_obj[type] = [].concat(res.data.result.data.reg.average);

            for(let i = 0,len = this.team_diff_obj[type].length; i < len; i ++) {
              let itemS = this.team_diff_obj[type][i].item;
              this.team_diff_data.push({
                item: itemS,
                type: this.team_diff_obj[type][i].score
              });
              // if(this.wordMap[this.team_diff_obj.guest_team[i].item]) {
              //   let itemS = this.team_diff_obj.guest_team[i].item;
              //   let tempObj = {};
              //   tempObj.item = itemS;
              //   tempObj.score = {
              //       guest: this.team_diff_obj.guest_team[i].score,
              //       host: this.team_diff_obj.host_team[i].score
              //   }
              // }
            }
          });
        } else {
          return this.$axios.get(`/api?p=radar&p=radar&s=leaders&a=team&tid=${tid}&_=` + (new Date()).getTime());
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .compare{
    background: #f4f4f9;
    padding-top: 120px;
    min-height: 100vh;
    .team_input{
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        display: inline-block;
        width: 240px;
        text-align: center;
      }
      input{
        border: solid 1px #ececec;
        border-radius: 2px;
        padding: 7px 0 7px 12px;
        font-size: 14px;
        background: transparent;
        border-color: #ccc;
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
          justify-content: center;
          align-items: center;
          div{
            padding: 4px 0 ;
            span{
              color: #000;
            }
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
              width: 240px;
            }
          }
        }
      }
    }
  }
</style>

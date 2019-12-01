<template>
  <div class="home">
    <ul>
      <li v-for="(item, index) in nav" :key="index">
        <span @click="goTo(item.url)">{{ item.cn }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import { mapMutations } from "vuex"
  export default {
    name: "home",
    data() {
      return {
        nav:[
          {
            cn: "赛程",
            url: "schedule"
          },
          {
            cn: "排名",
            url: "rank"
          }
        ],
        teamsTid: []
      }
    },
    created() {
      document.title = "首页";
      this.getAllTeamTid();
    },
    methods: {
      getAllTeamTid() {
        this.$axios.get('api?p=radar&p=radar&s=team&a=hireracy&_=' + (new Date()).getTime()).then( res => {
          let tempRes = res.data.result.data;
          for( let key in tempRes) {
            for( let keys in tempRes[key]) {
              this.teamsTid = this.teamsTid.concat(tempRes[key][keys]);
            }
          }
          this.setTeamsTid(this.teamsTid)
        })
      },
      ...mapMutations(['setTeamsTid']),
      goTo(url) {
        const { href } = this.$router.resolve({
          path: url
        })
        window.open(href, '_blank')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .home{
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('http://n.sinaimg.cn/sports/2_ori/upload/cf0d0fdd/711/w938h573/20191128/1ec7-iixnuaa1295721.jpg') no-repeat center;
    background-size: 100% 100%;
    ul {
      display: flex;
      width: 100%;
      background: #6750a2;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px #f3eaa3;
      li {
        padding: 7px ;
        span {
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }
      }
    }
  }
</style>

<template>
    <div style="background-color: #f7f7f7;">
        <van-row class="row-head-top">
            <van-col span="8">{{year}}</van-col>
            <van-col span="8">收入</van-col>
            <van-col span="8">支出</van-col>
        </van-row>
        <van-row class="row-head-bottom">
            <van-col span="8" style="display: flex; justify-content: flex-start;">
                <van-dropdown-menu>
                    <van-dropdown-item @close="dropdownItemClose" :title="month" title-class="dropdown-title">
                        <van-datetime-picker
                                v-model="currentDate"
                                type="year-month"
                                :max-date="maxDate"
                                :show-toolbar="false"
                                :formatter="formatter"
                        />
                    </van-dropdown-item>
                </van-dropdown-menu>
            </van-col>
            <van-col span="8">{{amount["income"]}}</van-col>
            <van-col span="8">{{amount["expend"]}}</van-col>
        </van-row>
        <van-row style="height: calc(100% - 102px)">
            <van-list style="height: 100%; overflow-y: auto;"
                    :finished="true"
                    finished-text="没有更多了"
            >
                <div v-for="(list, index) in lists" :key="index">
                    <van-cell class="cell-title" :title="list.date">
                        <span class="amount">收入：{{list['income']}}</span>
                        <span class="amount">支出：{{list['expend']}}</span>
                    </van-cell>
                    <van-cell
                            v-for="(item, key) in list.details"
                            :key="key"
                            icon-prefix="iconfont"
                            :icon="item.icon"
                            :title="item['remark']"
                            size="large"
                    >
                        {{item['money']}}
                    </van-cell>
                </div>
            </van-list>
        </van-row>
        <Tabbar></Tabbar>
    </div>
</template>

<script>
    import Tabbar from "@/components/Tabbar";

    export default {
        name: "Detail",
        data() {
            return {
                currentDate: this.$store.state.currentDate, // 当前时间选择器选择的时间
                maxDate: new Date(), // 时间选择器可选最新日期
                amount: {}, // 收入支出金额
                lists: [], // 账单明细列表
            }
        },
        components: {
            Tabbar
        },
        mounted() {
            this.getBills();
        },
        methods: {
            /*格式化下拉时间选择器*/
            formatter(type, val) {
                if (type === 'year') {
                    return `${val}年`;
                } else if (type === 'month') {
                    return `${val}月`;
                }
                return val;
            },
            /*下拉时间选择器关闭事件*/
            dropdownItemClose() {
                this.$store.setCurrentDate(this.currentDate);
                this.getBills();
            },
            getBills() {
                this.$axios.get(`/bill/${this.$store.jsonParse(this.$store.state.user)["userId"]}/${this.currentDate}`)
                .then(response => {
                    this.amount = response.data.amount;
                    this.lists = response.data.list;
                })
                .catch(error => {
                    console.log(error);
                });
            }
        },
        computed: {
            /*时间选择器年标题*/
            year: function () {
                const year = this.currentDate.getFullYear();
                return `${year}年`
            },
            /*时间选择器月标题*/
            month: function () {
                const month = this.currentDate.getMonth() + 1;
                return `${month < 10 ? '0' + month : month}月`;
            }
        }
    }
</script>

<style scoped>
    .van-col {
        padding-left: 20px;
        padding-top: 5px;
    }
    .row-head-top,
    .row-head-bottom {
        background-color: #fff;
        /*box-shadow: 0 2px 3px #ccc;*/
    }
    .row-head-top {
        color: #ccc;
        font-size: 14px;
    }
    .row-head-bottom {
        font-size: 18px;
        font-weight: bold;
        color: #000;
        padding-bottom: 5px;
    }
    .row-head-bottom > .van-col {
        line-height: 18px;
    }
    .van-col >>> .dropdown-title {
        font-size: 18px;
        font-weight: bold;
    }
    .van-col >>> .van-hairline--top-bottom::after {
        border-width: 0;
    }
    .van-col >>> .van-dropdown-menu {
        height: auto;
    }
    .van-col >>> .van-dropdown-menu__title {
        padding: 0 8px 0 0;
    }
    .cell-title {
        color: #969799;
    }
    .amount {
        width: 50%;
        display: inline-block;
    }
</style>
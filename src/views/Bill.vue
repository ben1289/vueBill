<template>
    <div>
        <nav-bar/>
        <van-divider>结余</van-divider>
        <van-row id="balance-box">
            <van-col span="8" offset="8" style="font-size: 28px">1239.00</van-col>
            <van-col span="8">
                <van-dropdown-menu>
                    <van-dropdown-item :title="currentYear + '年'" @close="dropdownItemClose" title-class="dropdown-title">
                        <van-picker :columns="years" :default-index="years.length - 1" ref="yearPicker"/>
                    </van-dropdown-item>
                </van-dropdown-menu>
            </van-col>
        </van-row>
        <van-row>
            <van-col span="12"><span class="title-span">收入</span><span class="value-span">3003.00</span></van-col>
            <van-col span="12"><span class="title-span">支出</span><span class="value-span">389.00</span></van-col>
        </van-row>
        <van-cell-group>
            <van-cell>
                <van-col span="6">月份</van-col>
                <van-col span="6">收入</van-col>
                <van-col span="6">支出</van-col>
                <van-col span="6">结余</van-col>
            </van-cell>
            <van-cell>
                <van-col span="6">04月</van-col>
                <van-col span="6">0</van-col>
                <van-col span="6">201</van-col>
                <van-col span="6">-201</van-col>
            </van-cell>
        </van-cell-group>

        <tabbar/>
    </div>
</template>

<script>
    import NavBar from "@/components/NavBar";
    import Tabbar from "@/components/Tabbar";

    export default {
        name: "Bill",
        components: {
            NavBar, Tabbar
        },
        data() {
            return {
                years: [],
                currentYear: ''
            }
        },
        mounted() {
            this.$axios.get(`/getBillTime/${this.$store.jsonParse(this.$store.state.user)["userId"]}`)
                .then(response => {
                    const years = response.data.years;
                    this.years = years;
                    this.currentYear = years[years.length - 1];
                });
        },
        methods: {
            dropdownItemClose() {
                this.currentYear = this.$refs.yearPicker.getValues()[0];

            }
        }
    }
</script>

<style scoped>
    .van-col {
        text-align: center;
    }
    .van-dropdown-menu {
        padding-right: 20px;
        float: right;
    }
    #balance-box {
        height: 28px;
        line-height: 28px;
        padding-bottom: 20px;
    }
    #balance-box .van-col,
    .van-dropdown-menu {
        height: inherit;
        line-height: inherit;
    }
    .van-dropdown-menu::after {
        border: none;
    }
    .van-dropdown-menu >>> .dropdown-title {
        font-size: 16px;
        /*font-weight: bold;*/
    }
    .title-span {
        color: #999;
        font-size: 14px;
        padding-right: 15px;
    }
    .value-span {
        font-size: 18px;
    }
    .van-cell-group {
        margin-top: 30px;
    }
</style>
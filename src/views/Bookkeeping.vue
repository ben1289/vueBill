<template>
    <div>
        <!--导航栏-->
        <nav-bar/>

        <van-tabs
                style="height: inherit"
                v-model="tabActive"
                type="card"
                color="#1989fa"
                title-active-color="#eee"
                title-inactive-color="#444"
                animated
                swipeable
        >
            <van-tab title="支出" title-style="font-size: 20px; font-weight: bold;">
                <van-grid column-num="3" :border="false" icon-size="38px" gutter="40px" square>
                    <van-grid-item v-for="(item, index) in expendCategories" :key="index">
                        <div
                                :class="`icon-box${item['categoryId'] == selected ? ` icon-selected` : ''}`"
                                @click="clickIconBox(item['categoryId'])"
                        >
                            <van-icon class-prefix="iconfont" :name="item['categoryIcon']" size="38px"/>
                            <span class="category-name">{{item['categoryName']}}</span>
                        </div>
                    </van-grid-item>
                </van-grid>
            </van-tab>
            <van-tab title="收入" title-style="font-size: 20px; font-weight: bold;">
                <van-grid column-num="3" :border="false" icon-size="38px" gutter="40px" square>
                    <van-grid-item v-for="(item, index) in incomeCategories" :key="index">
                        <div
                                :class="`icon-box${item['categoryId'] == selected ? ` icon-selected` : ''}`"
                                @click="clickIconBox(item['categoryId'])"
                        >
                            <van-icon class-prefix="iconfont" :name="item['categoryIcon']" size="38px"/>
                            <span class="category-name">{{item['categoryName']}}</span>
                        </div>
                    </van-grid-item>
                </van-grid>
            </van-tab>
        </van-tabs>

        <!--数字键盘-->
        <van-number-keyboard
                :show="showKeyboard"
                theme="custom"
                :title="amount"
                extra-key="."
                close-button-text="完成"
                @input="keyboardInput"
                @delete="keyboardDelete"
                @close="confirmKeyboard"
        >
            <template #title-left>
                <van-field v-model="remark" label="备注：" size="large">
                    <template #left-icon>
                        <van-button :text="date" size="small" @click="selectDate" round/>
                    </template>
                </van-field>
            </template>
        </van-number-keyboard>

        <!--弹出层 日期选择器-->
        <van-popup
                v-model="showPopup"
                position="bottom"
                @close="popupClose"
                round
        >
            <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    :show="true"
                    :max-date="maxDate"
                    @confirm="confirmDate"
                    @cancel="cancelDate"
            />
        </van-popup>
    </div>
</template>

<script>
    import NavBar from "@/components/NavBar";

    export default {
        name: "Bookkeeping",
        components: {
            NavBar
        },
        data() {
            return  {
                // 账单id
                billId: 0,
                // 支出或收入页
                tabActive: 0,
                // 选中的账单类型Id
                selected: 0,
                // 账单的金额
                amount: "",
                // 是否显示数字键盘
                showKeyboard: false,
                // 是否显示日期选择器
                showPopup: false,
                // 当前选中的日期
                currentDate: new Date(),
                // 选择确定的日期
                date: "今天",
                // 可选择最新日期
                maxDate: new Date(),
                // 备注
                remark: "",
                // 支出账单类型列表
                expendCategories: [],
                // 收入账单类型列表
                incomeCategories: []
            }
        },
        mounted() {
            /*设置账单类型*/
            this.$axios.get(`/category`)
                .then(response => {
                    this.expendCategories = response.data["expend"];
                    this.incomeCategories = response.data["income"];
                })
                .catch(error => {
                    console.log(error);
                });
            this.judge();
        },
        methods: {
            /*判断是账单新增还是编辑*/
            judge() {
                let params = this.$route.params;
                if (JSON.stringify(params) === "{}")
                    return;
                this.billId = params.billId ? params.billId : 0;
                this.tabActive = params.categoryState ? params.categoryState : 0;
                this.selected = params.categoryId ? params.categoryId : 0;
                if (params.billAmount) {
                    this.amount = params.billAmount;
                    this.showKeyboard = true;
                }
                if (params.billTime) {
                    this.currentDate = params.billTime;
                    this.date = this.$store.format(this.currentDate);
                }
                this.remark = params.billRemark ? params.billRemark : "";
            },
            /*选中某个账单类型*/
            clickIconBox(categoryId) {
                this.selected = categoryId;
                this.showKeyboard = true;
            },
            /*敲击数字键盘*/
            keyboardInput(key) {
                this.amount += key;
                if (this.amount.length === 2 && key !== '.')
                    this.amount = this.amount.replace(/\b(0+)/gi, "");
            },
            /*数字键盘完成键*/
            confirmKeyboard() {
                let params = {};
                params.billId = this.billId !== 0 ? this.billId : '';
                params.userId = this.$store.jsonParse(this.$store.state.user)["userId"];
                params.categoryId = this.selected;
                params.billAmount = this.tabActive === 0 ? parseFloat(`-${this.amount}`) : parseFloat(this.amount);
                params.billTime = this.$store.format(this.currentDate);
                params.billRemark = this.remark;

                this.$axios({
                    method: `POST`,
                    url: params.billId ? '/modifyBill' : '/bill',
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    },
                    data: params
                })
                    .then(() => {
                        params.billId
                            ? this.$notify({type: 'primary', message: '修改成功😁'})
                            : this.$notify({type: 'primary', message: '记账成功😁'});
                        this.$router.go(-1);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            /*数字键盘删除键*/
            keyboardDelete() {
                this.amount = this.amount.substring(0, this.amount.length - 1);
            },
            /*数字键盘日期按钮*/
            selectDate() {
                this.showPopup = true;
            },
            /*日期选择器确定按钮*/
            confirmDate() {
                this.date = this.$store.format(this.currentDate);
                this.showPopup = false;
            },
            /*日期选择器取消按钮*/
            cancelDate() {
                this.showPopup = false;
            },
            /*关闭弹出层*/
            popupClose() {
                this.currentDate = this.date === "今天" ? new Date() : new Date(this.date);
            }
        }
    }
</script>

<style scoped>
    .van-nav-bar {
        margin: 10px 0 20px 0;
    }
    .van-nav-bar .van-icon,
    .van-nav-bar__text {
        color: #000;
    }
    .van-tabs >>> .van-tabs__wrap {
        margin-bottom: 20px;
    }
    .van-tabs >>> .van-tabs__content {
        height: inherit;
    }
    .van-grid-item >>> .van-grid-item__content {
        padding: 0;
    }
    .icon-box {
        height: 100%;
        width: 100%;
        display: flex;
        border-radius: 50%;
        background-color: #F9F9F9;
        justify-content: center;
        align-items: center;
    }
    .icon-selected {
        background-color: #E8F3FE;
    }
    .van-number-keyboard >>> .van-number-keyboard__title {
        font-size: 18px;
        text-align: right;
        padding-right: 10px;
    }
    .van-field {
        padding: 0;
    }
    .van-field >>> .van-field__label {
        width: auto;
        line-height: 30px;
        padding-left: 5px;
    }
    .van-field >>> .van-field__body {
        line-height: 30px;
    }
    .category-name {
        position: absolute;
        bottom: -23px;
        line-height: 20px;
    }
</style>
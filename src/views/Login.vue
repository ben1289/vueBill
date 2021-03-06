<template>
    <div>
        <van-nav-bar :border="false">
            <template #title><img src="../assets/images/logo_long.png" style="padding-top: 20px;" alt=""></template>
        </van-nav-bar>
        <van-tabs
                style="height: calc(100% - 74px)"
                v-model="active"
                color="#6083B8"
                title-active-color="#000"
                title-inactive-color="#ccc"
                :border="false"
                animated
                swipeable>
            <van-tab title="登录" title-style="font-size: 20px; font-weight: bold;">
                <van-form @submit="login">
                    <van-field
                            v-model="account"
                            name="account"
                            placeholder="用户名/手机号/邮箱"
                            size="large"
                    />
                    <van-field
                            v-model="password"
                            type="password"
                            name="password"
                            placeholder="输入密码"
                            size="large"
                    />
                    <div style="margin: 16px; text-align: center">
                        <van-button class="button-radius"
                                    :disabled="loginDisabled"
                                    color="linear-gradient(to right, #4bb0ff, #6149f6)"
                                    native-type="submit"
                                    square
                                    block
                        >
                            登录
                        </van-button>
                        <a class="tag-a">忘记密码</a>
                    </div>
                </van-form>
            </van-tab>
            <van-tab title="注册" title-style="font-size: 20px; font-weight: bold;">
                <van-form @submit="register">
                    <van-field
                            v-model="userNickname"
                            name="userNickname"
                            placeholder="输入昵称"
                            size="large"
                            :rules="[{ pattern: /^\S{3,}$/, message: '用户名至少需要3个字符且不包括空格' }]"
                            required
                    />
                    <van-field
                            v-model="userName"
                            name="userName"
                            placeholder="输入用户名"
                            size="large"
                            :rules="[{ pattern: /^[0-9a-zA-Z]{6,}$/, message: '用户名至少需要6个字母或数字' }]"
                            required
                    />
                    <van-field
                            v-model="userMail"
                            name="userMail"
                            placeholder="输入邮箱"
                            size="large"
                    />
                    <van-field
                            v-model="userPhone"
                            name="userPhone"
                            placeholder="输入手机号"
                            size="large"
                    />
                    <van-field
                            @input="passwordCheck"
                            v-model="userPassword"
                            type="password"
                            name="userPassword"
                            placeholder="设置密码"
                            size="large"
                            :rules="[{ pattern: /^.{6,}$/, message: '密码至少为6位' }]"
                            required
                    />
                    <van-field
                            @blur="passwordCheck"
                            v-model="againPassword"
                            type="password"
                            name="userPassword"
                            placeholder="确认密码"
                            size="large"
                            :error="error"
                            :error-message="errorMessage"
                            required
                    />
                    <div style="margin: 16px;">
                        <van-button class="button-radius"
                                    :disabled="registerDisabled"
                                    color="linear-gradient(to right, #4bb0ff, #6149f6)"
                                    native-type="submit"
                                    square
                                    block
                        >
                            注册
                        </van-button>
                    </div>
                </van-form>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                active: 0,
                account: '',
                password: '',
                loginDisabled: true,
                userNickname: '',
                userName: '',
                userMail: '',
                userPhone: '',
                userPassword: '',
                againPassword: '',
                registerDisabled: true,
                error: false,
                errorMessage: ''
            };
        },
        methods: {
            /*登录*/
            login(params) {
                this.$axios.post("/login", this.$qs.stringify(params))
                    .then(response => {
                        if (response.status === 200) {
                            // 将用户存储在本地
                            response.data.password = params.password;
                            localStorage.setItem("user", JSON.stringify(response.data));
                            // 将用户存储在store
                            this.$store.setIsLoginAction(true);
                            this.$store.setUserAction(response.data);
                            const redirect = this.$route.query.redirect ? this.$route.query.redirect : "/details";
                            this.$router.replace({path: redirect});
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            /*注册*/
            register(params) {
                this.$axios.post("/user", params)
                    .then(response => {
                        if (response.status === 200) {
                            this.$toast.success("注册成功");
                            let data = {
                                account: params.userName,
                                password: params.userPassword
                            };
                            this.login(data);
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
            /*参数校验*/
            paramsPattern() {
                return /^\S{3,}$/.test(this.userNickname)
                    && /^[0-9a-zA-Z]{6,}$/.test(this.userName)
                    && /^.{6,}$/.test(this.userPassword);
            },
            /*密码校验*/
            passwordCheck() {
                if (this.againPassword === '')
                    return;
                if (this.againPassword === this.userPassword) {
                    this.error = false;
                    this.errorMessage = '';
                    this.registerDisabled = !this.paramsPattern();// 只有参数校验成功才可以启用注册按钮
                } else {
                    this.error = true;
                    this.errorMessage = '密码不一致';
                    this.registerDisabled = true;
                }
            }
        },
        computed: {
            /*整合登录参数*/
            loginParams: function () {
                const {account, password} = this;
                return {account, password};
            },
            /*整合注册参数*/
            registerParams: function () {
                const {userNickname, userName, userPassword, againPassword} = this;
                return {userNickname, userName, userPassword, againPassword}
            }
        },
        watch: {
            /*监听登录参数*/
            loginParams: function (params) {
                if (params.account !== '' && params.password !== '') {
                    this.loginDisabled = false;
                }
            },
            /*监听注册参数*/
            registerParams: function (params) {
                if (params.userNickname !== ''
                    && params.userName !== ''
                    && params.userPassword !== ''
                    && params.againPassword !== '') {
                    this.passwordCheck();
                }
            }
        }
    }
</script>

<style scoped>
    .van-form {
        padding: 0 20px;
    }
    .van-field {
        font-size: 16px;
    }
    .button-radius {
        border-radius: 10px;
    }
    .tag-a {
        display: block;
        margin-top: 5px;
        font-size: 14px;
        font-weight: 500;
        color: #6083B8;
    }
    div >>> .van-nav-bar {
        height: 74px;
        line-height: 74px;
    }
    .van-tabs >>> .van-tabs__wrap {
        margin-bottom: 60px;
    }
    .van-tabs >>> .van-tabs__content {
        height: calc(100% - 104px);
    }
</style>
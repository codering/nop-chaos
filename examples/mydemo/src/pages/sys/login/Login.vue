<template>
  <div class="login">
    <h2>登录</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="username">用户名：</label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div>
        <label for="password">密码：</label>
        <input type="password" id="password" v-model="password" />
      </div>
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import {useAdapter, ajaxRequest} from '@nop-chaos/sdk';

  const {setAuthToken} = useAdapter();
    const username = ref("");
    const password = ref("");

    const handleSubmit = async () => {
      try {
        const response = await ajaxRequest({
          url: `/r/LoginApi__login?@selection=token:accessToken`,
          data: {
            loginType: 1,
            principalId: username.value,
            principalSecret: password.value,
            verifyCode: '',
            verifySecret: ''
          },
          // 登录页面发现异常时会自己弹出错误提示信息，这里禁用ajaxRequest内部的提示框
          silent: true
        })
        if (response.token) {
          setAuthToken(response.token);
          location.href = '/'
        } else {
          alert("登录失败，请检查用户名和密码。");
        }
      } catch (error) {
        console.error(error);
      }
    };
</script>

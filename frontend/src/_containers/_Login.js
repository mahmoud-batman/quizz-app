// import React, { Component } from "react";
// import { NavLink, Link } from "react-router-dom";
// import { connect } from "react-redux";
// import { authLogin, resetError } from "../store/actions";

// import { Form, Icon, Input, Button, Spin } from "antd";
// const FormItem = Form.Item;
// const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

// class NormalLoginForm extends Component {
//   componentDidMount() {
//     const { isAuthenticated } = this.props;
//     if (isAuthenticated) {
//       this.props.history.push("/");
//     }
//     this.props.onResetError();
//   }

//   componentWillReceiveProps(newProps) {
//     if (newProps.user !== "") {
//       this.props.history.push("/");
//     }
//   }

//   errorMessage = (error) => {
//     const { status, data } = error.response;
//     const passwordError = data.password;
//     if (status >= 400 && status < 500) {
//       return passwordError ? (
//         <h3 style={{ color: "red" }}>{passwordError}</h3>
//       ) : (
//         <h3 style={{ color: "red" }}>Wrong Credentials</h3>
//       );
//     } else if (status >= 500) {
//       return <h3 style={{ color: "red" }}>Server Error</h3>;
//     }
//   };

//   handleSubmit = (e) => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         this.props.onAuth(values.email, values.password);
//       }
//     });
//   };

//   render() {
//     const { getFieldDecorator } = this.props.form;
//     const { error, loading } = this.props;

//     return (
//       <>
//         {error && this.errorMessage(error)}
//         <Form onSubmit={this.handleSubmit} className="login-form">
//           <Form.Item>
//             {getFieldDecorator("email", {
//               rules: [
//                 {
//                   type: "email",
//                   message: "The input is not valid E-mail!",
//                 },
//                 {
//                   required: true,
//                   message: "Please input your E-mail!",
//                 },
//               ],
//             })(
//               <Input
//                 prefix={
//                   <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
//                 }
//                 placeholder="Email"
//               />
//             )}
//           </Form.Item>

//           <FormItem>
//             {getFieldDecorator("password", {
//               rules: [
//                 { required: true, message: "Please input your Password!" },
//               ],
//             })(
//               <Input
//                 prefix={
//                   <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
//                 }
//                 type="password"
//                 placeholder="Password"
//               />
//             )}
//           </FormItem>

//           <FormItem>
//             {loading ? (
//               <>
//                 <Spin indicator={antIcon} />
//               </>
//             ) : (
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 style={{ marginRight: "10px" }}
//               >
//                 Login
//               </Button>
//             )}{" "}
//             Or
//             <Link style={{ marginRight: "10px" }} to="/signup/">
//               {" "}
//               signup
//             </Link>
//           </FormItem>
//         </Form>
//       </>
//     );
//   }
// }

// const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(
//   NormalLoginForm
// );

// const mapStateToProps = (state) => {
//   return {
//     loading: state.AuthReducer.loading,
//     error: state.AuthReducer.error,
//     user: state.AuthReducer.user,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onAuth: (email, password) => dispatch(authLogin(email, password)),
//     onResetError: (_) => dispatch(resetError()),
//   };
// };
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(WrappedNormalLoginForm);

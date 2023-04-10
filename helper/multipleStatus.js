const invokeMemberTabNotification = require("../Firebase/MemberTab");
const Status = require("../models/Admission/status");
const Student = require("../models/Student");
const Batch = require("../models/Batch");
const NewApplication = require("../models/Admission/NewApplication");
const Admission = require("../models/Admission/Admission");
const FeeStructure = require("../models/Finance/FeesStructure");
const RemainingList = require("../models/Admission/RemainingList");
const OrderPayment = require("../models/RazorPay/orderPayment");
const FeeReceipt = require("../models/RazorPay/feeReceipt");
const Admin = require("../models/superAdmin");
const {
  add_all_installment,
  add_total_installment,
  set_fee_head_query,
} = require("./Installment");

exports.insert_multiple_status = async (args, uargs, iargs, sid) => {
  try {
    const statusArray = [
      {
        content: `You have applied for ${args.applicationName} has been filled successfully.Stay updated to check status of your application.Tap here to see username ${uargs?.username}`,
        applicationId: args?._id,
        instituteId: iargs?._id,
      },
      {
        content: `You have been selected for ${args.applicationName}. Confirm your admission`,
        applicationId: args?._id,
        instituteId: iargs?._id,
        for_selection: "No",
        studentId: sid,
        admissionFee: args.admissionFee,
        payMode: "offline",
        isPaid: "Paid",
      },
      {
        content: `Your admission is on hold please visit ${iargs.insName}, ${iargs.insDistrict}. with required fees or contact institute if neccessory`,
        applicationId: args?._id,
        instituteId: iargs?._id,
      },
      {
        content: `Welcome to Institute ${iargs.insName}, ${iargs.insDistrict}.Please visit with Required Documents to confirm your admission`,
        applicationId: args?._id,
        instituteId: iargs?._id,
        document_visible: true,
      },
      {
        content: `Your seat has been confirmed, You will be alloted your class shortly, Stay Update!`,
        applicationId: args?._id,
        instituteId: iargs?._id,
      },
    ];

    Status.insertMany(statusArray)
      .then((value) => {
        // for (var val of value) {
        uargs.applicationStatus.push(...value);
        // }
      })
      .catch((e) => {
        console.log("Not Saved Status");
      });
    await uargs.save();
  } catch (e) {
    console.log(e);
  }
};

exports.ignite_multiple_alarm = async (arr) => {
  try {
    var all_status = await Status.find({
      _id: { $in: arr?.applicationStatus },
    });
    for (var ref of all_status) {
      invokeMemberTabNotification(
        "Admission Status",
        ref.content,
        "Application Status",
        arr._id,
        arr.deviceToken
      );
    }
    return true;
  } catch (e) {
    console.log(e);
  }
};

exports.fee_reordering = async (
  type,
  mode,
  price,
  stu_query,
  apply,
  institute,
  finance,
  admission,
  s_admin,
  new_receipt,
  user
) => {
  try {
    var student = await Student.findById({ _id: `${stu_query?._id}` }).populate(
      {
        path: "fee_structure",
      }
    );
    var is_install;
    if (
      price <= student?.fee_structure?.total_admission_fees &&
      price <= student?.fee_structure?.one_installments?.fees
    ) {
      is_install = true;
    } else {
      is_install = false;
    }
    new_receipt.student = student?._id;
    new_receipt.application = apply?._id;
    new_receipt.finance = finance?._id;
    s_admin.invoice_count += 1;
    new_receipt.invoice_count = `${
      new Date().getMonth() + 1
    }${new Date().getFullYear()}${s_admin.invoice_count}`;
    var total_amount = add_total_installment(student);
    if (price > 0 && !is_install) {
      var new_remainFee = new RemainingList({
        appId: apply._id,
        applicable_fee: student?.fee_structure?.total_admission_fees,
      });
      new_remainFee.remaining_array.push({
        remainAmount: price,
        appId: apply._id,
        status: "Paid",
        instituteId: institute._id,
        installmentValue: "One Time Fees",
        mode: mode,
        isEnable: true,
        fee_receipt: new_receipt?._id,
      });
      new_remainFee.paid_fee += price;
      new_remainFee.remaining_fee +=
        student?.fee_structure?.total_admission_fees - price;
      student.remainingFeeList.push(new_remainFee?._id);
      student.remainingFeeList_count += 1;
      new_remainFee.student = student?._id;
      new_remainFee.fee_receipts.push(new_receipt?._id);
      admission.remainingFee.push(student._id);
      new_remainFee.fee_structure = student?.fee_structure?._id;
      student.admissionRemainFeeCount +=
        student?.fee_structure?.total_admission_fees - price;
      apply.remainingFee +=
        student?.fee_structure?.total_admission_fees - price;
      admission.remainingFeeCount +=
        student?.fee_structure?.total_admission_fees - price;
      const valid_one_time_fees =
        student?.fee_structure?.total_admission_fees - price == 0
          ? true
          : false;
      if (valid_one_time_fees) {
        admission.remainingFee.pull(student._id);
      } else {
        new_remainFee.remaining_array.push({
          remainAmount: student?.fee_structure?.total_admission_fees - price,
          appId: apply._id,
          status: "Not Paid",
          instituteId: institute._id,
          installmentValue: "One Time Fees Remain",
          isEnable: true,
        });
      }
    } else if (is_install && price > 0) {
      admission.remainingFee.push(student._id);
      student.admissionRemainFeeCount += total_amount - price;
      apply.remainingFee += total_amount - price;
      admission.remainingFeeCount += total_amount - price;
      var new_remainFee = new RemainingList({
        appId: apply._id,
        applicable_fee: total_amount,
      });
      new_remainFee.remaining_array.push({
        remainAmount: price,
        appId: apply._id,
        status: "Paid",
        instituteId: institute._id,
        installmentValue: "First Installment",
        mode: mode,
        isEnable: true,
        fee_receipt: new_receipt?._id,
      });
      new_remainFee.paid_fee += price;
      new_remainFee.remaining_fee += total_amount - price;
      student.remainingFeeList.push(new_remainFee?._id);
      student.remainingFeeList_count += 1;
      new_remainFee.student = student?._id;
      new_remainFee.fee_receipts.push(new_receipt?._id);
      new_remainFee.fee_structure = student?.fee_structure?._id;
      await add_all_installment(
        apply,
        institute._id,
        new_remainFee,
        price,
        student
      );
    }
    if (mode === "Offline") {
      admission.collected_fee += price;
      admission.offlineFee += price;
      apply.collectedFeeCount += price;
      apply.offlineFee += price;
      finance.financeAdmissionBalance += price;
      finance.financeTotalBalance += price;
      finance.financeSubmitBalance += price;
    } else if (mode === "Online") {
      admission.onlineFee += price;
      apply.collectedFeeCount += price;
      apply.onlineFee += price;
      finance.financeAdmissionBalance += price;
      finance.financeTotalBalance += price;
      finance.financeBankBalance += price;
    } else {
    }
    student.admissionPaidFeeCount += price;
    student.paidFeeList.push({
      paidAmount: price,
      appId: apply._id,
    });
    await set_fee_head_query(student, price, apply, new_receipt);
    apply.confirmedApplication.push({
      student: student._id,
      payment_status: mode,
      install_type: is_install
        ? "First Installment Paid"
        : "One Time Fees Paid",
      fee_remain: is_install
        ? total_amount - price
        : student?.fee_structure?.total_admission_fees - price,
    });
    apply.confirmCount += 1;
    const order = new OrderPayment({});
    order.payment_module_type = "Admission Fees";
    order.payment_to_end_user_id = institute?._id;
    order.payment_by_end_user_id = user._id;
    order.payment_module_id = apply._id;
    order.payment_amount = price;
    order.payment_status = "Captured";
    order.payment_flag_to = "Credit";
    order.payment_flag_by = "Debit";
    order.payment_mode = mode;
    order.payment_admission = apply._id;
    order.payment_from = student._id;
    order.payment_invoice_number = s_admin.invoice_count;
    user.payment_history.push(order._id);
    institute.payment_history.push(order._id);
    await Promise.all([new_receipt.save(), new_remainFee.save(), order.save()]);
  } catch (e) {
    console.log(e);
  }
};

exports.fee_reordering_direct_student = async (
  student,
  institute,
  batchSet,
  user,
  finance
) => {
  try {
    for (var ref of batchSet) {
      // var student = await Student.findById({ _id: stu_query?._id });
      var price = parseInt(ref.amount);
      const new_receipt = new FeeReceipt({
        fee_payment_mode: "Offline",
        fee_payment_amount: price,
      });
      var apply = await NewApplication.findById({ _id: ref?.appId });
      var admission = await Admission.findById({
        _id: `${apply?.admissionAdmin}`,
      });
      var batch = await Batch.findById({ _id: ref?.batchId });
      var fee_structure = await FeeStructure.findById({ _id: ref?.fee_struct });
      var student_structure = {
        fee_structure: fee_structure,
      };
      new_receipt.student = student?._id;
      new_receipt.application = apply?._id;
      new_receipt.finance = finance?._id;
      new_receipt.fee_transaction_date = new Date();
      var is_install;
      if (
        price <= fee_structure?.total_admission_fees &&
        price <= fee_structure?.one_installments?.fees
      ) {
        is_install = true;
      } else {
        is_install = false;
      }
      var total_amount = add_total_installment(student_structure);
      if (price > 0 && !is_install) {
        var new_remainFee = new RemainingList({
          appId: apply._id,
          applicable_fee: fee_structure?.total_admission_fees,
        });
        new_remainFee.paid_fee += price;
        new_remainFee.fee_structure = fee_structure?._id;
        new_remainFee.remaining_fee +=
          fee_structure?.total_admission_fees - price;
        student.remainingFeeList.push(new_remainFee?._id);
        student.remainingFeeList_count += 1;
        new_remainFee.student = student?._id;
        admission.remainingFee.push(student._id);
        student.admissionRemainFeeCount +=
          fee_structure?.total_admission_fees - price;
        new_remainFee.fee_receipts.push(new_receipt?._id);
        apply.remainingFee += fee_structure?.total_admission_fees - price;
        admission.remainingFeeCount +=
          fee_structure?.total_admission_fees - price;
        new_remainFee.remaining_array.push({
          remainAmount: price,
          appId: apply._id,
          status: "Paid",
          instituteId: institute._id,
          installmentValue: "One Time Fees",
          mode: "Offline",
          isEnable: true,
          fee_receipt: new_receipt?._id,
        });
        const valid_one_time_fees =
          fee_structure?.total_admission_fees - price == 0 ? true : false;
        if (valid_one_time_fees) {
          admission.remainingFee.pull(student._id);
        } else {
          new_remainFee.remaining_array.push({
            remainAmount: fee_structure?.total_admission_fees - price,
            appId: apply._id,
            status: "Not Paid",
            instituteId: institute._id,
            installmentValue: "One Time Fees Remain",
            isEnable: true,
          });
        }
      } else if (is_install && price > 0) {
        admission.remainingFee.push(student._id);
        student.admissionRemainFeeCount += total_amount - price;
        apply.remainingFee += total_amount - price;
        admission.remainingFeeCount += total_amount - price;
        var new_remainFee = new RemainingList({
          appId: apply._id,
          applicable_fee: total_amount,
        });
        new_remainFee.paid_fee += price;
        new_remainFee.fee_structure = fee_structure?._id;
        new_remainFee.remaining_fee += total_amount - price;
        student.remainingFeeList.push(new_remainFee?._id);
        student.remainingFeeList_count += 1;
        new_remainFee.fee_receipts.push(new_receipt?._id);
        new_remainFee.student = student?._id;
        new_remainFee.remaining_array.push({
          remainAmount: price,
          appId: apply._id,
          status: "Paid",
          instituteId: institute._id,
          installmentValue: "First Installment",
          mode: "Offline",
          isEnable: true,
          fee_receipt: new_receipt?._id,
        });
        await add_all_installment(
          apply,
          institute._id,
          new_remainFee,
          price,
          student_structure
        );
      }
      student.admissionPaidFeeCount += price;
      student.paidFeeList.push({
        paidAmount: price,
        appId: apply._id,
      });
      await set_fee_head_query(
        student,
        price,
        apply,
        new_receipt,
        fee_structure
      );
      apply.allottedApplication.push({
        student: student._id,
        payment_status: "Offline",
        install_type: is_install
          ? "First Installment Paid"
          : "One Time Fees Paid",
        fee_remain: is_install
          ? total_amount - price
          : fee_structure?.total_admission_fees - price,
      });
      apply.allotCount += 1;
      new_remainFee.batchId = batch?._id;
      user.applyApplication.push(apply._id);
      await Promise.all([
        new_remainFee.save(),
        apply.save(),
        admission.save(),
        new_receipt.save(),
      ]);
    }
  } catch (e) {
    console.log(e);
  }
};

exports.fee_reordering_direct_student_payload = async (
  student,
  institute,
  batchSet,
  user,
  finance
) => {
  try {
    for (var ref of batchSet) {
      // var student = await Student.findById({ _id: stu_query?._id });
      var price = ref?.amount ? parseInt(ref?.amount) : 0;
      if (price > 0 && ref?.batchId && ref?.appId && ref?.fee_struct) {
        var apply = await NewApplication.findById({ _id: ref?.appId });
        var admission = await Admission.findById({
          _id: `${apply?.admissionAdmin}`,
        });
        var batch = await Batch.findById({ _id: ref?.batchId });
        var fee_structure = await FeeStructure.findById({
          _id: ref?.fee_struct,
        });
        var student_structure = {
          fee_structure: fee_structure,
        };
        var is_install;
        if (
          price <= fee_structure?.total_admission_fees &&
          price <= fee_structure?.one_installments?.fees
        ) {
          is_install = true;
        } else {
          is_install = false;
        }
        var total_amount = add_total_installment(student_structure);
        if (price > 0 && !is_install) {
          var new_remainFee = new RemainingList({
            appId: apply._id,
            applicable_fee: fee_structure?.total_admission_fees,
          });
          for (var nest of ref?.remain_array) {
            const s_admin = await Admin.findById({
              _id: `${process.env.S_ADMIN_ID}`,
            }).select("invoice_count");
            const nestPrice = nest?.amount ? parseInt(nest?.amount) : 0;
            if (nestPrice <= 0) {
            } else {
              var new_receipt = new FeeReceipt({
                fee_payment_mode: nest?.mode,
                fee_payment_amount: nestPrice,
              });
              new_receipt.student = student?._id;
              new_receipt.application = apply?._id;
              new_receipt.finance = finance?._id;
              new_receipt.fee_transaction_date = new Date();
              s_admin.invoice_count += 1;
              new_receipt.invoice_count = `${
                new Date().getMonth() + 1
              }${new Date().getFullYear()}${s_admin.invoice_count}`;
              new_remainFee.fee_receipts.push(new_receipt?._id);
              new_remainFee.remaining_array.push({
                remainAmount: nestPrice,
                appId: apply._id,
                status: "Paid",
                instituteId: institute._id,
                installmentValue: "One Time Fees",
                mode: nest?.mode,
                isEnable: true,
                fee_receipt: new_receipt?._id,
              });
              await Promise.all([new_receipt.save(), s_admin.save()]);
            }
          }
          new_remainFee.paid_fee += price;
          new_remainFee.fee_structure = fee_structure?._id;
          if (fee_structure?.total_admission_fees - price > 0) {
            new_remainFee.remaining_fee +=
              fee_structure?.total_admission_fees - price;
            student.remainingFeeList.push(new_remainFee?._id);
            student.remainingFeeList_count += 1;
            new_remainFee.student = student?._id;
            admission.remainingFee.push(student._id);
            student.admissionRemainFeeCount +=
              fee_structure?.total_admission_fees - price;
            apply.remainingFee += fee_structure?.total_admission_fees - price;
            admission.remainingFeeCount +=
              fee_structure?.total_admission_fees - price;
            const valid_one_time_fees =
              fee_structure?.total_admission_fees - price == 0 ? true : false;
            if (valid_one_time_fees) {
              admission.remainingFee.pull(student._id);
            } else {
              new_remainFee.remaining_array.push({
                remainAmount: fee_structure?.total_admission_fees - price,
                appId: apply._id,
                status: "Not Paid",
                instituteId: institute._id,
                installmentValue: "One Time Fees Remain",
                isEnable: true,
              });
            }
          } else {
            new_remainFee.remaining_fee += 0;
            student.remainingFeeList.push(new_remainFee?._id);
            new_remainFee.student = student?._id;
            student.admissionRemainFeeCount += 0;
            if (new_remainFee.remaining_fee > 0) {
            } else {
              new_remainFee.status = "Paid";
            }
            apply.remainingFee += 0;
            admission.remainingFeeCount += 0;
            if (price - fee_structure?.total_admission_fees > 0) {
              admission.refundCount +=
                price - fee_structure?.total_admission_fees;
              admission.refundFeeList.push({
                student: student?._id,
                refund: price - fee_structure?.total_admission_fees,
              });
            }
            const valid_one_time_fees =
              fee_structure?.total_admission_fees - price == 0 ? true : false;
            if (valid_one_time_fees) {
              admission.remainingFee.pull(student._id);
            } else {
              new_remainFee.remaining_array.push({
                remainAmount: fee_structure?.total_admission_fees - price,
                appId: apply._id,
                status: "Not Paid",
                instituteId: institute._id,
                installmentValue: "One Time Fees Remain",
                isEnable: true,
              });
            }
          }
        } else if (is_install && price > 0) {
          if (total_amount - price > 0) {
            student.admissionRemainFeeCount += total_amount - price;
            apply.remainingFee += total_amount - price;
            admission.remainingFeeCount += total_amount - price;
            admission.remainingFee.push(student._id);
          } else {
            student.admissionRemainFeeCount += 0;
            apply.remainingFee += 0;
            admission.remainingFeeCount += 0;
            if (price - total_amount > 0) {
              admission.refundCount += price - total_amount;
              admission.refundFeeList.push({
                student: student?._id,
                refund: price - total_amount,
              });
            }
          }
          var new_remainFee = new RemainingList({
            appId: apply._id,
            applicable_fee: total_amount,
          });

          for (var nest of ref?.remain_array) {
            const s_admin = await Admin.findById({
              _id: `${process.env.S_ADMIN_ID}`,
            }).select("invoice_count");
            var nestPrice = nest?.amount ? parseInt(nest?.amount) : 0;
            if (nestPrice <= 0) {
            } else {
              var new_receipt = new FeeReceipt({
                fee_payment_mode: nest?.mode,
                fee_payment_amount: nestPrice,
              });
              new_receipt.student = student?._id;
              new_receipt.application = apply?._id;
              new_receipt.finance = finance?._id;
              new_receipt.fee_transaction_date = new Date();
              s_admin.invoice_count += 1;
              new_receipt.invoice_count = `${
                new Date().getMonth() + 1
              }${new Date().getFullYear()}${s_admin.invoice_count}`;
              new_remainFee.fee_receipts.push(new_receipt?._id);
              new_remainFee.remaining_array.push({
                remainAmount: nestPrice,
                appId: apply._id,
                status: "Paid",
                instituteId: institute._id,
                installmentValue: "First Installment",
                mode: nest?.mode,
                isEnable: true,
                fee_receipt: new_receipt?._id,
              });
              await Promise.all([new_receipt.save(), s_admin.save()]);
            }
          }

          new_remainFee.paid_fee += price;
          new_remainFee.fee_structure = fee_structure?._id;
          new_remainFee.remaining_fee +=
            total_amount - price > 0 ? total_amount - price : 0;
          student.remainingFeeList.push(new_remainFee?._id);
          student.remainingFeeList_count += 1;
          if (new_remainFee.remaining_fee > 0) {
          } else {
            new_remainFee.status = "Paid";
          }
          new_remainFee.student = student?._id;
          if (total_amount - price > 0) {
            await add_all_installment(
              apply,
              institute._id,
              new_remainFee,
              price,
              student_structure
            );
          }
        }
        student.admissionPaidFeeCount += price;
        student.paidFeeList.push({
          paidAmount: price,
          appId: apply._id,
        });
        await set_fee_head_query(
          student,
          price,
          apply,
          new_receipt,
          fee_structure
        );
        apply.allottedApplication.push({
          student: student._id,
          payment_status: "Offline",
          install_type: is_install
            ? "First Installment Paid"
            : "One Time Fees Paid",
          fee_remain: is_install
            ? total_amount - price > 0
              ? total_amount - price
              : 0
            : fee_structure?.total_admission_fees - price,
        });
        apply.allotCount += 1;
        new_remainFee.batchId = batch?._id;
        new_remainFee.remark = ref?.remark;
        user.applyApplication.push(apply._id);
        await Promise.all([
          new_remainFee.save(),
          apply.save(),
          admission.save(),
          // new_receipt.save(),
        ]);
      } else {
      }
    }
  } catch (e) {
    console.log(e);
  }
};

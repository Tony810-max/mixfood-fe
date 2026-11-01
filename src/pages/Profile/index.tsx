import Header from "@/components/layout/Header";
import { useCancelReservation } from "@/hooks/api/useReservations";
import { useReservations } from "@/hooks/useReservations";
import { MotionConfig, motion } from "framer-motion";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { UpdateProfileForm } from "./components/UpdateProfileForm";
import { useProfile } from "./hooks/useProfile";
import { ReservationHistoryTable } from "./components/ReservationHistoryTable";

const ProfilePage = () => {
  const {
    t,
    user,
    isLoading,
    activeSection,
    setActiveSection,
    updateInfoForm,
    setUpdateInfoForm,
    updateInfoErrors,
    handleUpdateInfo,
    changePasswordForm,
    setChangePasswordForm,
    changePasswordErrors,
    handleChangePassword,
    handleLogout,
  } = useProfile();
  const { reservations, isLoading: reservationsLoading, error: reservationsError, stats, refreshReservations } = useReservations();
  const cancelReservation = useCancelReservation();

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-background">
      <Header />
      <main className="min-h-[calc(100vh-80px)] pt-20 md:pt-24">
        <ProfileHeader user={user} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
            {/* Sidebar Navigation */}
            <ProfileSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onLogout={handleLogout}
              labels={{
                accountSettings: t.profileAccountSettings,
                profileUpdateInfo: t.profileUpdateInfo,
                profileChangePassword: t.profileChangePassword,
                reservationsTitle: t.reservationsTitle,
                headerLogout: t.headerLogout,
              }}
            />

            {/* Content Area */}
            <div className="min-w-0 flex-1">
              {activeSection === "info" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <UpdateProfileForm
                    formData={updateInfoForm}
                    errors={updateInfoErrors}
                    isLoading={isLoading}
                    onInputChange={(field, value) => setUpdateInfoForm(prev => ({ ...prev, [field]: value }))}
                    onSubmit={handleUpdateInfo}
                    labels={{
                      title: t.profilePersonalInfoTitle,
                      fullName: t.registerFullName,
                      email: t.email,
                      phone: t.phoneNumber,
                      fullNamePlaceholder: t.fullNamePlaceholder,
                      emailPlaceholder: t.emailPlaceholder,
                      phonePlaceholder: t.phonePlaceholder,
                      emailNote: t.profileEmailNote,
                      save: t.profileUpdateButton,
                      saving: t.profileUpdating,
                    }}
                  />
                </motion.div>
              )}

              {activeSection === "password" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChangePasswordForm
                    formData={changePasswordForm}
                    errors={changePasswordErrors}
                    isLoading={isLoading}
                    onInputChange={(field, value) => setChangePasswordForm(prev => ({ ...prev, [field]: value }))}
                    onSubmit={handleChangePassword}
                    labels={{
                      title: t.profileChangePasswordTitle,
                      currentPassword: t.profileCurrentPassword,
                      newPassword: t.profileNewPassword,
                      confirmPassword: t.profileConfirmNewPassword,
                      currentPasswordPlaceholder: t.profileCurrentPasswordPlaceholder,
                      newPasswordPlaceholder: t.registerPasswordPlaceholder,
                      confirmPasswordPlaceholder: t.registerConfirmPasswordPlaceholder,
                      save: t.profileChangePasswordButton,
                      saving: t.profileUpdating,
                    }}
                  />
                </motion.div>
              )}

              {activeSection === "reservations" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <ReservationHistoryTable
                    reservations={reservations}
                    isLoading={reservationsLoading}
                    error={reservationsError}
                    stats={stats}
                    onRefresh={refreshReservations}
                    onCancel={(id, reason) => cancelReservation.mutate({ id, reason })}
                    isCancelling={cancelReservation.isPending}
                    labels={{ title: t.reservationsTitle, subtitle: t.reservationsSubtitle, total: t.reservationsTotal, pending: t.reservationsStatusPending, confirmed: t.reservationsStatusConfirmed, arrived: t.reservationsStatusArrived, cancelled: t.reservationsStatusCancelled, search: t.reservationsSearch, all: t.reservationsTabAll, newest: t.reservationsSortNewest, oldest: t.reservationsSortOldest, byStatus: t.reservationsSortStatus, refresh: t.reservationsRefresh, refreshSuccess: t.reservationsRefreshSuccess, refreshError: t.reservationsRefreshError, customer: t.reservationsCustomer, date: t.reservationsDate, guests: t.reservationsGuests, status: t.reservationsStatus, actions: t.reservationsActions, cancel: t.reservationsCancel, empty: t.reservationsEmpty, cancelTitle: t.reservationCancelDialogTitle, cancelDescription: t.reservationCancelDialogDescription, keep: t.reservationCancelDialogKeep, cancelling: t.reservationCancelDialogConfirming, cancelledBy: t.reservationsCancelledBy, cancelledByUser: t.reservationsCancelledByUser, cancelledByAdmin: t.reservationsCancelledByAdmin, cancelledBySystem: t.reservationsCancelledBySystem, automaticCancellationReason: t.reservationsAutomaticCancellationReason, reason: t.reservationsCancellationReason, reasonPlaceholder: t.reservationsCancellationReasonPlaceholder, reasonHint: t.reservationsCancellationReasonHint, unknown: t.reservationsUnknown, locale: t.locale }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </MotionConfig>
  );
};

export default ProfilePage;

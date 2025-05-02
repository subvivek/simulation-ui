import SidebarDefault from './SidebarDefault'
import SidebarAlert from './SidebarAlert'

const Sidebar = ({
    alertSkus,
    selectedLevel,
    onSkuClick,
    onBackToMenu,
    activeSku
  }) => {
    return alertSkus.length > 0 ? (
      <SidebarAlert
        alertSkus={alertSkus}
        selectedLevel={selectedLevel}
        onSkuClick={onSkuClick}
        onBackToMenu={onBackToMenu}
        activeSku={activeSku} // 🔁 Pass it through
      />
    ) : (
      <SidebarDefault />
    )
  }  

export default Sidebar

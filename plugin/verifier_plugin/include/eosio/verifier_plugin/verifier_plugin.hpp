/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
#pragma once
#include <appbase/application.hpp>

#include <eosio/chain_plugin/chain_plugin.hpp>

namespace fc { class variant; }

namespace eosio {
   using chain::transaction_id_type;
   using std::shared_ptr;
   using namespace appbase;
   using chain::name;
   using fc::optional;
   using chain::uint128_t;

   typedef shared_ptr<class verifier_plugin_impl> verifier_ptr;
   typedef shared_ptr<const class verifier_plugin_impl> verifier_const_ptr;

namespace verifier_apis {

class read_only {
  verifier_const_ptr verifier;

   public:
      read_only(verifier_const_ptr&& verifier)
         : verifier(verifier) {}

      struct get_access_token_params {
         chain::account_name     controlling_account;
      };
      struct get_access_token_results {
         string                        access_token;   
      };
      get_access_token_results get_access_token(const get_access_token_params& params) const;
};


} // namespace history_apis

class verifier_plugin : public plugin<verifier_plugin> {
   public:
      APPBASE_PLUGIN_REQUIRES((chain_plugin))

      verifier_plugin();
      virtual ~verifier_plugin();

      virtual void set_program_options(options_description& cli, options_description& cfg) override;

      void plugin_initialize(const variables_map& options);
      void plugin_startup();
      void plugin_shutdown();

      verifier_apis::read_only  get_read_only_api()const { return verifier_apis::read_only(verifier_const_ptr(my)); }

   private:
      verifier_ptr my;
};

} /// namespace eosio

FC_REFLECT(eosio::verifier_apis::read_only::get_access_token_params, (controlling_account) )
FC_REFLECT(eosio::verifier_apis::read_only::get_access_token_results, (access_token) )
